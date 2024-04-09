import React, { useState } from "react";
import { useTable, useExpanded, useSortBy, useRowSelect } from "react-table";

const TreeTable = ({ columns, data, initialState }) => {  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,    
    prepareRow,
    state: { expanded } 
  } = useTable(
    {
      columns,
      data,
      initialState,
    },        
    useExpanded,
  );

  const [ clkActive , setClkActive] = useState("");

  const toggleActive = (e, rowIdx) => {
    setClkActive(rowIdx);
  };
  
  return (
    <>
      <table className="table table--min" {...getTableProps()}>        
        <thead>
          {headerGroups.map((headerGroup, index) => (
            
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column) => (                
                <th {...column.getHeaderProps( { style: { width: column.width }, } )} key={index}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              // <tr {...row.getRowProps(formatRowProps && formatRowProps(row) )}>
              //console.log(clkActive),
              <tr {...row.getRowProps()} className={`${clkActive === idx ? 'active': ''}`} onClick={(e) => {toggleActive(e, idx)}} key={idx}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={idx}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>      
    </>
  );
};

export default TreeTable;