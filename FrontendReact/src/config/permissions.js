export const rolePermissions = {

    admin: {
        dashboard: true,
        equipment: true,
        maintenance: true,
        approval: true,
        history: true
    },

    engineer: {
        dashboard: true,
        equipment: true,
        maintenance: true,
        approval: false,
        history: true
    },

    supervisor: {
        dashboard: true,
        equipment: true,
        maintenance: true,
        approval: true,
        history: true
    },

    manager: {
    dashboard: true,
    equipment: true,
    maintenance: false,
    approval: true,
    history: true
    }

};