const {addBookHandler, getBooksHandler, getBookByIdHandler , editBookByIdHandler, deleteBookByIdHandler} = require("./handler");
const books = require("./books")

const routes = [
    {
        //menambahkan buku
        method : "POST",
        path : "/books",
        handler : addBookHandler        
    },
    {
        //menampilkan seluruh buku
        method : "GET",
        path: "/books",
        handler : getBooksHandler
    
    },
    {
        //menampilkan detail
        method : "GET",
        path: `/books/{bookId}`,
        handler : getBookByIdHandler
       
    },
    {
        //mengubah buku by id
        method : "PUT",
        path : "/books/{bookId}",
        handler : editBookByIdHandler
    },
    {
        //menghapus buku
        method :"DELETE",
        path : `/books/{bookId}`,
        handler : deleteBookByIdHandler
        
    },



];


module.exports = routes;