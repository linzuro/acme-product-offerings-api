const Sequelize = require("sequelize");
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/acme_offerings");

const Company = conn.define("company", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  }
});
const Product = conn.define("product", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  },
  suggestedPrice: {
    type: Sequelize.DECIMAL,
    allowNull:false,
    unique:false,
    notEmpty:true
  }
});
const Offering = conn.define("offering", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    unique: false,
    notEmpty: true
  }
});

Company.hasMany(Offering);
Offering.belongsTo(Company);
Offering.belongsTo(Product);
Product.hasMany(Offering);

const sync = async () => {
  await conn.sync({ force: true });

  const [AcmeUS, AcmeGlobal, AcmeTri] = await Promise.all([
    Company.create({ name: "acme us" }),
    Company.create({ name: "acme global" }),
    Company.create({ name: "acme tri" })
  ]);

  const [Foo, Bar, Bazz] = await Promise.all([
    Product.create({ name: "foo", suggestedPrice: 5.75}),
    Product.create({ name: "bar", suggestedPrice: 3.25}),
    Product.create({ name: "bazz", suggestedPrice: 4.50})
  ]);

  const [Coffee, Computer, Bagel] = await Promise.all([
    Offering.create({ price: 7, companyId: AcmeGlobal.id, productId: Bar.id }),
    Offering.create({ price: 8, companyId: AcmeTri.id, productId: Bazz.id }),
    Offering.create({ price: 9, companyId: AcmeUS.id, productId: Foo.id })
  ]);
};

const readFile=async(table)=>{
    const data = await conn.query(`SELECT * FROM ${table}`)
    return data[0]
}

module.exports = {
  sync,
  readFile,
  models: {
    Company,
    Product,
    Offering
  }
};