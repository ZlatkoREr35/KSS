const express = require ('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', {layout: false});
});

app.post('/send', (req, res)=>{
    const output = `
    <p> Imate novi zahtev za kontakt </p>
    <h2> Kontakt Detalji </h2>
    <ul> 
        <li> Ime: ${req.body.ime} </li>
        <li> Prezime: ${req.body.prezime} </li>
        <li> Email: ${req.body.email} </li>
        <li> Telefon: ${req.body.telefon} </li>
        <li> Naslov Poruke: ${req.body.naslov} </li>
        <li> Ime Kompanije: ${req.body.kompanije} </li>
    </ul>
    <h3> Poruka </h3>
    <p> ${req.body.message}</p>
    `;
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false, 
        auth: {
            user: 'c2fb452f5d1011',
            pass: 'b3664d0b282431'
        },
        tls:{
            rejectUnauthorized:false 
        }

    });
    let mailOptions = {
        from: '221cbcf60a-ed3eee@inbox.mailtrap.io',//adresa posiljaoca
        to: 'zlatko.stosanovic.mes@gmail.com',//lista korisnika koji ce dobiti poruku
        subject: 'NodemailerKss',
        text: 'Zdravo Svete',
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            return console.log(error);
        }
        console.log('Poruka Poslata: %s',info.messageId);

        console.log('URL pregled: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact',{layout:false}, {msg:'Email poruka je poslata'});
    });
});

app.listen(3000, () => console.log('Server started...'));