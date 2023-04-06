import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts, users } from './database'
import { ACCOUNT_TYPE, TAccount, TUser } from './types'


// veremos mais sobre os path params
///pratica 1 = criar um endpoint de busca especificapor id
/// no index crie o seguinte endppoint: metodo get; path /accounts/:id; params áth params id; body nenhum; output 200 resultado da busca;

// PRATICA 2
//deleteAccount (delte uma conta via id)
//implemente um endpoint que seleciona o item via path params (id) e o deleta: metodo DELETE; path /accounts/:id; params path params id; body nenhum, output 200 "item deletedo com sucesso"

// PRATICA 3
//editAccount (edita conta via id)
//implememte um endppoijnt de autalização que seleciona o item via path params (id ) e recebe  os dados a serem alterados via body: metodo PUT; path /accounts/:id; params path params id; body id, ownerName, balance, type; output (201 ) "consta alterada"

//      FIXAÇÃO

//Vimos toda a acriação de endpoint no express (GET, POST, PUT, DELETE), com isso em mente crie um CRUD de alguma entidade 

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})


//endpoint pratica 1
//getAccountById (busca conta por id)
//OBS: a ordem do endpoint com path params é iumportante (Pelo que entendi, melhor deixar ele no fim), caso abaixo dele eu tivesse um endpoint com query params, como meu codigo é lido de cima pra baixo, ele entenderia que no id do path entraria o serach do query, e o resultado seria errado
//OBS2: uma comvenção seria colocar na ordem 1- GETS, 2-POTS, 3-PUTS, 4-DELETES
//OBS3: o path params sempre terá o dois pontos(:) = accounts/:id




app.get("/accounts/:id", (req: Request, res: Response) => {
    // é req.parmas, se fosse query seria req.query
    const id: string = req.params.id

    const result: TAccount = accounts.find((account) => account.id === id)

    res.status(200).send(result)
})




//editAccount:

//OBS: breakpoint && = valor1 && valor 2 (se o valor um existir, retorne o segundo, caso não exista ele nem verifica nada e ja interrompe)
//     breakpoint || = valor1 || valor 2(se o valor 1 existir, ja retorna ele mesmo, se não ele retorna o segundo)

app.put("/accounts/:id", (req: Request, res: Response) => {

    const id: string = req.params.id
    //body
    const newOwnerName: string | undefined = req.body.ownerName
    const newBalance: number | undefined = req.body.balance
    const newType: ACCOUNT_TYPE | undefined = req.body.type

    const account: TAccount = accounts.find((account) => account.id === id)
    //verificação pra ver se o find retornou algo ou um undefined

    console.log("antes", account)
    if (account) {

        //verifica todas as opções do body. fazemos isso com um breakpoint Account.ownername recebera o valor de newOwnername (caso ele exsita) senão existir ele vai receber o nome antigo que ja tinha. O breakpoint vera se o newownername existe (se é string), se não existir (undefined) ele ja vai direto pra outra altermativa
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type
        // a verificação do balance é diferente (primeiro, verifica se o newbalance é um numero (se não passarmos nada sera undefined) com os isNan = is not a nunber (funções que verifica se algo não é  um numero  e retorna um boolean) ou seja, se não for um numero, retorne o account.balance, se for, retorne o newbalance)
        account.balance = isNaN(newBalance) ? account.balance : newBalance
        // o isNan faz basicamente isso: type of (newbalance) !== number

    }
    console.log("depois", account)

    res.status(201).send("conta alterada")






})


//deleteAccount:
//usaremos o find index (diferente do find que retorna o objeto, o findIndex retorna apenas o indice daquele objeto) e depois o metodo splice (rece dois parametros: o primeiro o index do array que ele comecara, e depois quantos items ele removera a partir do primeiro parametro (3,4 (a partir do index 3, remova 4 items)))
// OBS: a conts index é tipo number pq o index retornado é um number

app.delete("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const index: number = accounts.findIndex((account) => account.id === id)
    //  o findindex, caso não encontre o index que passamos(pq provavelmente ele não existe), retorna um -1 e acaba deletenado o ultimo item do array, então fazemos essa verificação primeiro
    if (index >= 0) {
        accounts.splice(index, 1)
    } else {
        res.send("nao encontrado")
    }

    console.log(index)
    console.log(accounts)

    res.status(200).send("item deletado com sucesso")
})

//  FIXAÇÃO
//metodo GET getAllUsers:

app.get ("/users", (req:Request, res:Response)=>{
    res.status(200).send(users)
})

//getUserByName (usa query params)
app.get("/users/search", (req: Request, res:Response)=>{

    const name = req.query.name as string

    const result = users.filter((user)=> user.name.toLowerCase().includes(name.toLowerCase()))

    res.status(200).send(result)


})

//getUserByID (usa path params)

app.get("/users/:id", (req: Request, res:Response)=>{

    const id = req.params.id

    const result = users.find((user)=> user.id === id)

    res.status(200).send(result)
})


//METODO POST createUser

app.post ("/users", (req:Request, res:Response)=>{
    const id:string = req.body.id
    const name:string = req.body.name
    const email:string = req.body.email

    const newUser = {id, name, email}
    
    users.push(newUser)

    res.status(200).send("usuario criado")
        
})

// metodo PUT editUser:

app.put("/users/:id", (req:Request, res:Response)=>{

    const id: string = req.params.id
    const newName: string | undefined = req.body.name
    const newEmail:string | undefined = req.body.email

    const search:TUser = users.find((user)=>user.id === id)
    console.log("usuario antes da edição", search)
    if(search){
        search.name = newName || search.name
        search.email = newEmail || search.email
    }

    console.log("usuario deppis edição", search)

    res.status(201).send("alterado com sucesso")

})

// deleteuser

app.delete("/users/:id", (req: Request, res:Response)=>{

    const id = req.params.id
    let message:string = "usuario alterado com sucesso"

    const result = users.findIndex((user)=> user.id === id)

    if(result>=0){

        users.splice(result, 1)
    }else{
        message = "usuario não encontrado"
    }

    res.status(200).send(message)

})








