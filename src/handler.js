const {nanoid} = require('nanoid');
let books = require('./books.js')

//1. untuk menambahkan buku
const addBookHandler = (request,h) =>{
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    }=request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    //kriteria kegagalan
    //name == null
    if(name === undefined){
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    };

    //readPage lebih besar dari pageCount
    if(readPage>pageCount){
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400);
        return response;
    };

    //membuat newBook
    newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    //cek kesuksesan push book
    const isSucces = books.filter((book)=>book.id === id).length >0;
    if(isSucces){
        const response = h.response({
            status : "success",
            message : "Buku berhasil ditambahkan",
            data:{
                bookId : id,
                
            },
        });
        response.code(201);
        return response;
    }

    //jika gagal push book
    const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;


};

//2. untuk menampilkan seluruh buku
const getBooksHandler = (requset,h)=>{
    const {name, reading, finished} = requset.query;
   
    //backup data asli books
    const tempBooks = books;
    //menyimpan buku yang difilter
    let filterBooks = books;
    
    //menampilkan data yang berada pada query
    if(name !== undefined){
        console.log(name.toLowerCase())
        filterBooks = books.filter((book)=>{
          return (book.name.toLowerCase().search(name.toLowerCase()) !== -1);
        });        
    }
    if(reading !== undefined){
        if(reading === "0"){
            filterBooks = books.filter((book)=>book.reading===false)
        }
        if(reading === "1"){
            filterBooks = books.filter((book)=>book.reading===true)
        }
    }
    if(finished  !== undefined){
        if(finished  === "0"){
            filterBooks = books.filter((book)=>book.finished ===false)
        }
        if(finished  === "1"){
            filterBooks = books.filter((book)=>book.finished ===true)
        }
    }
    books = filterBooks.map(newFormatBooks);
 
    const response = h.response({
        status : "success",
        data : {
            books
        }
    });
    response.code(200);
    // mengembalikan data asli books
    books = tempBooks;
    return response;     
};

// 3 untuk mendapatkan detail buku
const getBookByIdHandler = (request,h)=>{
    const {bookId} = request.params;
    const book = books.filter((book)=>book.id === bookId)[0];
    
    if (book !== undefined){
        const response = h.response({
            status: "success",
            data:{
                book
            },
           
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status : "fail",
        message: "Buku tidak ditemukan"
    });
    response.code(404);
    return response;
};

// 4 mengubah nilai dari buku
const editBookByIdHandler=(request,h)=>{
    const {bookId} = request.params;
    
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    }=request.payload;
    const updatedAt = new Date().toISOString();

    //cek name == null
    if(name === undefined){
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    };

    //readPage lebih besar dari pageCount
    if(readPage>pageCount){
        const response = h.response({
            status : "fail",
            message : "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400);
        return response;
    };

    //type dan data sama tetapi index masih -1 ??
    const index = books.findIndex((book)=>{ return book.id === bookId});
 
    //jika buku ditemukan indexnya maka index !== -1
    if (index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status :"success",
            message : "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    }

    // gagal. tidak menemukan index
    const response = h.response({
        status : "fail",
        message : "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;
};

// menghapus buku
const deleteBookByIdHandler=(request,h)=>{
    const {bookId}=request.params;
    //cek id book
    const index = books.findIndex((book)=> {return book.id===bookId});

    //jika terdapat book
    if(index !== -1){
        books.splice(index,1);
        const response = h.response({
            status : "success",
            message : "Buku berhasil dihapus"
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : "fail",
        message : "Buku gagal dihapus. Id tidak ditemukan"
    });
    response.code(404);
    return response;
}

//membuat array object books baru
function newFormatBooks(value){
    return ({
     "id":value.id,
     "name":value.name,
     "publisher":value.publisher
    });
 };

module.exports = {addBookHandler, getBooksHandler, getBookByIdHandler , editBookByIdHandler, deleteBookByIdHandler};