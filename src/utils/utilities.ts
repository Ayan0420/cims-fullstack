// UTILITY METHODS
export function getSearchArray(query) {
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