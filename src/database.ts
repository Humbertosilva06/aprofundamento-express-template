import { ACCOUNT_TYPE, TAccount, TUser } from "./types";

export const accounts: TAccount[] = [
    {
        id: "a001",
        ownerName: "Ciclano",
        balance: 10000,
        type: ACCOUNT_TYPE.GOLD
    },
    {
        id: "a002",
        ownerName: "Astrodev",
        balance: 500000,
        type: ACCOUNT_TYPE.BLACK
    },
    {
        id: "a003",
        ownerName: "Fulana",
        balance: 20000,
        type: ACCOUNT_TYPE.PLATINUM
    }
]


export const users: Array<TUser> = [

    {
        id: "u001",
        name: "humberto",
        email:"humberto@emaiol.com"
    },
    {
        id: "u002",
        name: "pedro",
        email:"pedro@emaiol.com"
    }


]