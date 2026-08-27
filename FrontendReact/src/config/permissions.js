export const rolePermissions = {

    admin: {
        dashboard: true,
        equipment: false,
        maintenance: true,
        approval: false,
        history: true,
        activityLog: true,
        auditTrail: true
    },

    engineer: {
        dashboard: true,
        equipment: true,
        maintenance: true,
        approval: false,
        history: true,
        activityLog: false,
        auditTrail: false
    },

    supervisor: {
        dashboard: true,
        equipment: true,
        maintenance: true,
        approval: true,
        history: true,
        activityLog: true,
        auditTrail: false
    },

    manager: {
        dashboard: true,
        equipment: false,
        maintenance: false,
        approval: true,
        history: true,
        activityLog: true,
        auditTrail: false
    }

};