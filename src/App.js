import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Headers } from "./data"
import Pagination from "./Pagination"
let PageSize = 10;

function App() {
  const [transaction, setTransaction] = useState([])
  const [filterTransactionList, setFilterTransactionList] = useState([])
  const [transactionSearch, setTransactionSearch] = useState("")
  const [loading, setLoading] = useState(1)
  const [emptyList, setEmptyList] = useState(false)
  const [currentPage, setCurrentPage] = useState(0);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return transaction.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  useEffect(() => {
    getTransaction()
  }, [])

  const getTransaction = () => {
    setLoading(true)

    axios("https://jsonplaceholder.typicode.com/posts").then(res => {
      setTimeout(() => {
        if (res?.data?.length > 0) {
          setTransaction(res.data)
          setCurrentPage(1)
          setEmptyList(false)
        } else {
          setEmptyList(true)
        }
        setLoading(false)
      }, 500);
    }).catch((e) => {
      console.log(e);
      setEmptyList(true)
      setLoading(false)
    })
  }

  const renderHeader = () => {
    return (
      <tr>
        {Headers.map((headerItem, index) =>
          <th key={index}>{headerItem}</th>
        )}
      </tr>
    )
  }

  const renderLoader = () => {
    return (
      <div className=" d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning mt-4" role="status">
          <span className="sr-only" />
        </div>
      </div>
    )
  }
  const renderTableBody = (list) => {
    return (
      list.map((Item, index) =>
        <tr key={index}>
          <td >{Item.id}</td>
          <td >{Item.userId}</td>
          <td >{Item.title}</td>
          <td >
            <span className="badge bg-success">
              {Item.id ? "paid" : "unpaid"}
            </span>
          </td>
          <td >{Item.id}</td>
          <td >{Item.id}</td>
          <td >{Item.id}</td>
          <td >{Item.id}</td>
          <td >
            <button className="btn btn-outline-danger" onClick={() => refundTransction(Item)}>
              Refund
            </button>
          </td>
        </tr>
      )
    )
  }

  const filterTransction = async (input) => {
    setLoading(true)
    var filteredTranscation = [];

    transaction.forEach((element, index) => {
      if (element.id.toString().indexOf(input.trim()) !== -1) {
        filteredTranscation = [...filteredTranscation, element];
      }
    })
    setFilterTransactionList(filteredTranscation)
    if (filteredTranscation.length > 0) {
      await setEmptyList(false)
    } else {
      await setEmptyList(true)
    }
    setLoading(false)
  };

  const searchInput = (value) => {
    setTransactionSearch(value)
    filterTransction(value)
  }

  const refundTransction = (item) => {
    return (
      alert("item refund ")
    )
  }
  const EmptyTransaction = () => {
    return (
      <div className="py-5 text-center">
        <h2>No Transaction yet</h2>
        <img className="d-block mx-auto mb-4" src="emptyList.png" alt="" height="400" />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="py-5 text-center">
        <img className="d-block mx-auto mb-4" src="valu.png" alt="" height="72" />
        <h2>Valu Transaction</h2>
      </div>
      {transaction.length !== 0 ?
        <>
          <div className="form-outline mb-4">
            <input
              className="form-control"
              id="datatable-search-input"
              placeholder="searching...."
              type="text"
              value={transactionSearch}
              onChange={(e) => searchInput(e.target.value)}
            />
          </div>
          { !emptyList ?
            <table className="table table-striped table-hover"  >
              <thead>
                {renderHeader()}
              </thead>
              <tbody>
                {renderTableBody(transactionSearch ? filterTransactionList : currentTableData)}
              </tbody>
            </table>
            :
            <EmptyTransaction />
          }
        </>
        : renderLoader()
      }
      {console.log("transactionSearch.trim()", Boolean(transactionSearch.trim()))}
      {
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={transactionSearch.length > 0 ? filterTransactionList.length : transaction.length}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        />}
    </div>
  );
}
export default App;
