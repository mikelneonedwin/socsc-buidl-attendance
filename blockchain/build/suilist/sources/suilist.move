module suilist::suilist {
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use std::string::String;
    use sui::table::Table;
    use std::vector;
    use sui::transfer;

    /// Error codes
    const EAlreadyRegistered: u64 = 1;
    const ENotAdmin: u64 = 2;
    const ERegNotFound: u64 = 3;

    /// Attendee object. ID auto-generates via UID.
    public struct Attendee has key, store {
        id: UID,
        name: String,
        department: String,
        reg_no: String,
        creator: address,
    }

    /// Shared registry holding the list and a lookup by registration number.
    public struct Registry has key {
        id: UID,
        admin: address,
        /// Append-only list of attendee object IDs (useful for frontend/indexer).
        attendee_ids: vector<ID>,
        /// Map registration number -> attendee ID (for quick uniqueness and lookup).
        by_reg_no: Table<String, ID>,
    }

    /// Create a new registry (non-entry, useful in tests or other modules).
    public fun new_registry(admin: address, ctx: &mut TxContext): Registry {
        Registry {
            id: sui::object::new(ctx),
            admin,
            attendee_ids: vector::empty<ID>(),
            by_reg_no: sui::table::new(ctx),
        }
    }

    /// Create and share a registry so anyone can interact with it on-chain.
    public fun create_and_share_registry(ctx: &mut TxContext) {
        let admin = sui::tx_context::sender(ctx);
        let registry = new_registry(admin, ctx);
        transfer::share_object(registry);
    }

    /// Register an attendee into a shared registry.
    /// Prevents duplicate registration numbers within this registry.
    public fun register_attendee(
        registry: &mut Registry,
        name: String,
        department: String,
        reg_no: String,
        ctx: &mut TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        register_internal(sender, registry, name, department, reg_no, ctx)
    }

    /// Internal helper that allows testing without a signer.
    public fun register_internal(
        sender: address,
        registry: &mut Registry,
        name: String,
        department: String,
        reg_no: String,
        ctx: &mut TxContext
    ) {
        // Prevent duplicate registration numbers.
        if (sui::table::contains(&registry.by_reg_no, reg_no)) {
            abort EAlreadyRegistered
        };

        let attendee = Attendee {
            id: sui::object::new(ctx),
            name,
            department,
            reg_no: reg_no,
            creator: sender,
        };

        let attendee_id = sui::object::id(&attendee);
        // Persist in registry structures
        vector::push_back(&mut registry.attendee_ids, attendee_id);
        sui::table::add(&mut registry.by_reg_no, reg_no, attendee_id);

        // The attendee object is owned by the sender (good for self-registration).
        transfer::transfer(attendee, sender);
    }

    /// Optional: remove an attendee by registration number. Only admin can remove.
    /// Requires the admin to present the Attendee object (owner must cooperate).
    public fun unregister_attendee(
        registry: &mut Registry,
        reg_no: String,
        attendee: Attendee,
        ctx: &TxContext
    ) {
        let admin = sui::tx_context::sender(ctx);
        if (admin != registry.admin) {
            // Only registry admin can remove records
            abort ENotAdmin
        };

        // Remove from lookup; get the ID that was registered under reg_no
        let id_from_map = sui::table::remove(&mut registry.by_reg_no, reg_no);
        // Remove from the vector
        let found = remove_id(&mut registry.attendee_ids, &id_from_map);
        if (!found) {
            // If it wasn't in the vector, the registry is inconsistent
            abort ERegNotFound
        };

        // Destroy the attendee or send it somewhere; here we destroy it.
        destroy_attendee(attendee);
    }

    /// Helper to destroy attendee (in case admin unregisters).
    fun destroy_attendee(attendee: Attendee) {
        let Attendee { id, name: _, department: _, reg_no: _, creator: _ } = attendee;
        sui::object::delete(id);
    }

    /// Remove an ID from a vector by swap-remove. Returns true if removed.
    fun remove_id(ids: &mut vector<ID>, target: &ID): bool {
        let len = vector::length<ID>(ids);
        let mut i = 0;
        while (i < len) {
            let cur = vector::borrow<ID>(ids, i);
            if (*cur == *target) {
                vector::swap_remove<ID>(ids, i);
                return true
            };
            i = i + 1;
        };
        false
    }

    // View helpers

    /// Return the registry admin.
    public fun admin(registry: &Registry): address {
        registry.admin
    }

    /// How many attendees are registered.
    public fun size(registry: &Registry): u64 {
        vector::length<ID>(&registry.attendee_ids)
    }

    /// Check if a registration number exists.
    public fun has_reg_no(registry: &Registry, reg_no: String): bool {
        sui::table::contains(&registry.by_reg_no, reg_no)
    }
}