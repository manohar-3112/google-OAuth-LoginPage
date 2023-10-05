const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const app = express();
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
      {
        clientID: '975127443831-5aa1m9rvcgf0jqp5983lmak4r8vv5t7g.apps.googleusercontent.com',
        clientSecret:'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',
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });


app.get('/', (req, res) => {
    const loginForm = `
      <style>
        /* CSS styles for the login form */
        body{
            margin-right:30%;
            margin-left:350px; 
            margin-top:100px;
            
        }
        label {
          color: orange;
        }
  
        input[type="text"],
        input[type="password"] {
          padding: 5px;
          margin: 5px 0px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 25%;
        }
  
        button[type="submit"] {
          padding: 10px 20px;
          background-color: #4285f4;
          color: #000;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
  
        button[type="submit"]:hover {
          background-color: #357ae8;
        }
  
        a.google-login-btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4285f4;
          color: #000;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: background-color 0.3s ease;
          margin-top: 10px;
          display: block;
          width: fit-content;
        }
  
        a.google-login-btn:hover {
          background-color: #357ae8;
        }
      </style>
  
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br>
      
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Login</button>
      <a href="/auth/google/" class="google-login-btn">Login With Google</a>
    `;
      res.send(loginForm);
  });
  

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/loginFailed' }),
  (req, res) => {
    res.redirect('/loginSuccess'); // Redirect to a success page or user profile page
  }
);

app.get('/loginSuccess',(req,res)=>{
    // let name=req.user.displayName()
    // res.status(200).send(`<h1>Hello ${name}</h1>`);
    const user = req.user;
      res.send(`<h2>name:</h2></h3>${user.displayName}</h3><h2>Email:</h2><h3>${user.emails[0].value}</h3><h2>Profile Image:</h2><img src="${user.photos[0].value}" alt="Profile Image" width:5px;height:5px/><br><br>
      <a href="/" style="text-decoration: none; background-color: #4285f4; color: #FFF; padding: 6px 15px; margin-top:30px; border-radius: 5px;">LOG OUT</a>
`);

})
app.get('/loginFailed',(req,res)=>{
    res.status(200).send("<h1>Login Failed !!</h1>");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
