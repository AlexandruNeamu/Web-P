const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')

const sequelize = new Sequelize('proiect', 'root','apaplata3', {
  dialect: 'mysql',
  define: {
    timestamps: false
  }
})

//USER

const User = sequelize.define('user', {
    nume: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
       type: Sequelize.STRING,
       allowNull: false,
       validate: {
        len: [1, 100]
      } 
    },
    parola: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
         len: [1, 100]
       } 
    }
  })

//USER

//PRODUS
const Product = sequelize.define('product', {
  denumire: {
     type: Sequelize.STRING,
     allowNull: false,
     validate: {
      len: [1, 100]
    } 
  },
  data_expirare: {
      type: Sequelize.DATE,
      allowNull: false
  },
  pret: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  calorii: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})
//PRODUS

User.hasMany(Product)

//GRUP
const Group = sequelize.define('group', {
  nume_grup: {
     type: Sequelize.STRING,
     allowNull: false,
     validate: {
      len: [1, 100]
    } 
  }
})
//GRUP

//PREFERINTA
const Preference = sequelize.define('preference', {
  denumire: {
     type: Sequelize.STRING,
     allowNull: true,
    //  validate: {
    //   len: [1, 100]
    // } 
  }
})
//PREFERINTA

User.hasMany(Preference)
Group.hasMany(Preference)

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/create', async (req, res, next) => {
  try {
    await sequelize.sync({ force: true })
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

//USER
app.get('/user', async (req, res, next) => {
    const query = {
      where: {}
    }
    if (req.query.filter) {
      query.where.column = {
        [Op.like]: `%${req.query.filter}%`
      }
    }
    let pageSize = 10
    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }
    if (req.query.page) {
      const page = parseInt(req.query.page)
      query.limit = pageSize
      query.offset = page * pageSize
    }
  
    try {
      const users = await User.findAll(query)
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  })

  app.post('/user', async (req, res, next) => {
    try {
      await User.create(req.body)
      res.status(201).json({ message: 'created' })
    } catch (err) {
      next(err)
    }
  })

  app.put('/user/:usid', async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.usid)
      if (user) {
        await user.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found'})
      }
    } catch (err) {
      next(err)
    }
  })

  app.delete('/user/:usid', async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.usid)
      if (user) {
        await user.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found'})
      }
    } catch (err) {
      next(err)
    }
  })
//USER

//PRODUS
app.get('/products', async (req, res, next) => {
  const query = {
    where: {}
  }
  if (req.query.filter) {
    query.where.column = {
      [Op.like]: `%${req.query.filter}%`
    }
  }
  let pageSize = 10
  if (req.query.pageSize) {
    pageSize = parseInt(req.query.pageSize)
  }
  if (req.query.page) {
    const page = parseInt(req.query.page)
    query.limit = pageSize
    query.offset = page * pageSize
  }

  try {
    const products = await Product.findAll(query)
    res.status(200).json(products)
  } catch (err) {
    next(err)
  }
})

app.get('/user/:usid/products', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid, {
      include: [ Product ]
    })
    if (user) {
      res.status(200).json(user.products)
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.post('/user/:usid/products', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    if (user) {
      const product = new Product(req.body)
      product.userId = user.id
      await product.save()
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.put('/user/:usid/products/:pid', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    if (user) {
      const products = await user.getProducts({
        id: req.params.pid
      })
      const product = products.shift()
      if (product) {
        product.denumire = req.body.denumire
        product.data_expirare = req.body.data_expirare
        product.pret = req.body.pret
        product.calorii = req.body.calorii
        await product.save()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found '})
      }
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.delete('/user/:usid/products/:pid', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    if (user) {
      const products = await user.getProducts({
        id: req.params.pid
      })
      const product = products.shift()
      if (product) {
        await product.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found '})
      }
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

//PRODUS

//GRUP
app.get('/groups', async (req, res, next) => {
  const query = {
    where: {}
  }
  if (req.query.filter) {
    query.where.column = {
      [Op.like]: `%${req.query.filter}%`
    }
  }
  let pageSize = 10
  if (req.query.pageSize) {
    pageSize = parseInt(req.query.pageSize)
  }
  if (req.query.page) {
    const page = parseInt(req.query.page)
    query.limit = pageSize
    query.offset = page * pageSize
  }

  try {
    const groups = await Group.findAll(query)
    res.status(200).json(groups)
  } catch (err) {
    next(err)
  }
})

app.post('/groups', async (req, res, next) => {
  try {
    await Group.create(req.body)
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

app.put('/groups/:gsid', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.gsid)
    if (group) {
      await group.update(req.body)
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found'})
    }
  } catch (err) {
    next(err)
  }
})

app.delete('/groups/:gsid', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.gsid)
    if (group) {
      await group.destroy()
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found '})
    }
  } catch (err) {
    next(err)
  }
})
//GRUP 

//PREFERINTE
app.get('/user/:usid/preferences', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid, {
      include: [ Preference ]
    })
    if (user) {
      res.status(200).json(user.preferences)
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.get('/group/:grid/preferences', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.grid, {
      include: [ Preference ]
    })
    if (group) {
      res.status(200).json(group.preferences)
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.get('/preferences', async (req, res, next) => {
  const query = {
    where: {}
  }
  if (req.query.filter) {
    query.where.column = {
      [Op.like]: `%${req.query.filter}%`
    }
  }
  let pageSize = 10
  if (req.query.pageSize) {
    pageSize = parseInt(req.query.pageSize)
  }
  if (req.query.page) {
    const page = parseInt(req.query.page)
    query.limit = pageSize
    query.offset = page * pageSize
  }

  try {
    const preferences = await Preference.findAll(query)
    res.status(200).json(preferences)
  } catch (err) {
    next(err)
  }
})


app.post('/user/:usid/group/:grid/preferences', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    const group = await Group.findByPk(req.params.grid)
    if (user && group) {
      const preference = new Preference(req.body)
      preference.userId = user.id
      preference.groupId = group.id
      await preference.save()
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.put('/user/:usid/group/:grid/preferences/:prid', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    const group = await Group.findByPk(req.params.grid)
    if (user && group) {
      const preferences = await user.getPreferences({
        id: req.params.prid
      })
      const preference = preferences.shift()
      if (preference) {
        preference.denumire = req.body.denumire
        await preference.save()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found '})
      }
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

app.delete('/user/:usid/group/:grid/preferences/:prid', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.usid)
    const group = await Group.findByPk(req.params.grid)
    if (user && group) {
      const preferences = await user.getPreferences({
        id: req.params.prid
      })
      const preference = preferences.shift()
      if (preference) {
        await preference.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found '})
      }
    } else {
      res.status(404).json({ message: 'not found '})
    }    
  } catch (err) {
    next(err)
  }
})

//PREFERINTE

  app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
  })
  
  app.listen(8080)