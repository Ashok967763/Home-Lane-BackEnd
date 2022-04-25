
const getBudgetHomes = req => {
    const Table = 'homes';
    const min = req.query.min;
    const max = req.query.max;

    return `SELECT * from dbo.${Table} WHERE price BETWEEN ${min} AND ${max}`;
};

const getsqftHomes = req => {
    const Table = 'homes';
    const sqft = req.query.sqft;

    return `SELECT * from dbo.${Table} WHERE sqft_living > ${sqft}`;
};

const getAgeHomes = req => {
    const Table = 'homes';
    const year = req.query.year;

    return `SELECT * from dbo.${Table} WHERE yr_built > ${year} OR yr_renovated > ${year}`;
};

module.exports = {
    getBudgetHomes,
    getsqftHomes,
    getAgeHomes
};