const express =require('express');
const exphbs = require('express-handlebars')
const app = express();
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash =require('connect-flash');
const session = require('express-session');
const path =require('path');
const passport =require('passport');
const ideas = require('./routes/ideas');
const  users =require('./routes/users');
//config passport
require('./config/passport')(passport);
// globle promise
mongoose.Promise= global.Promise;
//connect databases
mongoose.connect('mongodb+srv://add-ideas:vijay12#@cluster0-m9f3u.mongodb.net/test?retryWrites=true&w=majority',{
    //useMongoClient:true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log('mongodb connected......');
}).catch(err => console.log(err));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
  app.use(function(req, res, next){
      res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('error_msg');
      res.locals.error=req.flash('error');
      res.locals.user= req.user || null;
      next();
  })
 
 
// express-handlebars
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about')
});
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
