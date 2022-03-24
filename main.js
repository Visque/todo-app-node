const express = require("express");
const { type } = require("express/lib/response");
const fs = require("fs");

var app = express();
app.use(express.json());

const port = 3000;


app.get("/", (request, response) => {
  fs.readFile("./todo/index.html", "utf-8", (error, data) => {
    error ? response.end("F MEN :)") : response.end(data);
  });
});

app.get("/script.js", (request, response) => {
  fs.readFile("./todo/script.js", "utf-8", (error, data) => {
    error ? console.log(`couldn't get script.js file :)`) : response.end(data);
  });
});

app.get("/style.css", (request, response) => {
  fs.readFile("./todo/style.css", "utf-8", (error, data) => {
    response.end(data);
  });
});

// API Calls: -

app.post("/save", (request, response) => {
    fs.readFile("./db.txt", "utf-8", (error, data) => {
        var todos = data.length ? JSON.parse(data) : []

        todos.push(request.body)

        fs.writeFile('./db.txt', JSON.stringify(todos), (error, data) => {
            error ? response.end('F error occured while posting :)') : response.end()
        })
    });
    response.end();
})

app.get('/todo', (request, response) => {
    fs.readFile('./db.txt', 'utf-8', (error, data) => {
        response.end(data)
    })
})

app.post('/check', (request, response) => {
  
  fs.readFile('./db.txt', 'utf-8', (error, data) => {
    var key = request.body.key;
    var checkMark = request.body.check;
    
    var todos = data.length ? JSON.parse(data) : []

    var idx = todos.findIndex(x => x.id === key)
    todos[idx].check = checkMark;

    console.log(todos[idx])

    fs.writeFile('./db.txt', JSON.stringify(todos), (error, data) => {
      error ? response.end("F error occured while check-marking :)") : response.end(data);
    })
  })

})

app.delete('/deleteTodo', (request, response) => {

  fs.readFile("./db.txt", "utf-8", (error, data) => {
    var key = Number(request.body.id)
    var todos = data.length ? JSON.parse(data) : []

    todos = todos.filter(x => x.id !== key)

    fs.writeFile('./db.txt', JSON.stringify(todos), (error, data) => {
      error ? response.end("F error occured while deleting :)") : response.end(data);
    })

  })
})

app.listen(port, () => {
  console.log("server is live :)");
})

