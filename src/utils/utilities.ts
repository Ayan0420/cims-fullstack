// UTILITY METHODS
export function getSearchArrayLegacy(query) {
    return [
        {
            job_id: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cus_name: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cus_address: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cus_phone: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            unit_model: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            work_perf: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
    ];
}

export function getSearchForJobArray(query) {
    return [
        {
            jobOrderNum: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            trackingCode: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            unitModel: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            workPerformed: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
    ];
}

export function getSearchForCustomerArray(query) {
    return [
        {
            cusName: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cusAddress: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cusPhone: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
        {
            cusEmail: {
                $regex: query.keyword,
                $options: 'i',
            },
        },
    ];
}
