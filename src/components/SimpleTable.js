/* eslint-disable react/jsx-key */
import { Box, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { useTable } from "react-table";

const useStyles = makeStyles(() => ({
  /* This is required to make the table full-width */
  container: {
    display: "block",
    maxWidth: "100%",
    // overflowX: "scroll",
    overflowY: "hidden",
    // border: "1px solid black",
    "& table": {
      /* Make sure the inner table is always as wide as needed */
      width: "100%",
      borderSpacing: 0,

      "& tr": {
        "&:last-child": {
          "& td": {
            borderBottom: 0,
          },
        },
        "&:hover": {
          backgroundColor: "#efefef",
          cursor: "pointer",
        },
      },

      "& th, & td": {
        margin: 0,
        padding: "0.5rem",
        // borderBottom: "1px solid black",
        // borderRight: "1px solid black",

        /* The secret sauce */
        /* Each cell should grow equally */
        width: "1%",
        /* But "collapsed" cells should be as small as possible */
        "&.collapse": {
          width: "0.0000000001%",
        },

        "&:last-child": {
          borderRight: 0,
        },
      },
      "& th": {
        borderBottom: "1px solid #ddd",
      },
    },
  },

  /* This will make the table scrollable when it gets too small */
}));

// Create a default prop getter
const defaultPropGetter = () => ({});

function SimpleTable({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  // getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  page = 1,
  setPage = () => {},
  pageCount = 10,
  onRowClick = () => {},
  onRowHover = () => {},
}) {
  // Use the state and functions returned from useTable to build your UI
  const classes = useStyles();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <div className={classes.container}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps([
                    {
                      className: column.className,
                      style: column.style,
                    },
                    getColumnProps(column),
                    getHeaderProps(column),
                  ])}
                  //   style={headerStyle[column.id] ? headerStyle[column.id] : {}}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={(e) => onRowClick(e, row)}
                onMouseEnter={(e) => onRowHover(e, row)}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                        getColumnProps(cell.column),
                        getCellProps(cell),
                      ])}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Box display="flex" justifyContent="center" mt={10.5}>
        <Pagination
          count={pageCount}
          shape="rounded"
          showFirstButton
          showLastButton
          page={page}
          onChange={(e, pageNumber) => setPage(pageNumber)}
        />
      </Box>
    </div>
  );
}

export default React.memo(SimpleTable);
