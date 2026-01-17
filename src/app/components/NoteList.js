"use client";
import { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote, fetchNotes, updateNote } from "../redux/slices/note-slice";
import NoteDialog from "./common/NoteDialog";
import { Box } from "@mui/system";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { confirmDeleteAlert } from "../utills/confirm-alert";
import PushPinIcon from "@mui/icons-material/PushPin";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import debounce from "lodash.debounce";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { id: "pin", label: "pin" },

  { id: "title", label: "title" },
  {
    id: "content",
    label: "content",
  },
  {
    id: "category",
    label: "category",
  },
  {
    id: "created at",
    label: "created at",
  },
  {
    id: "actions",
    label: "actions",
  },
];

export default function NoteList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { notes ,total} = useSelector((state) => state.note);
  const [dialougeData, setDialougeData] = useState({
    open: false,
    type: "add",
    data: null,
    title: "",
  });

  const handleTogglePin = (note) => {
    dispatch(
      updateNote({
        id: note._id,
        data: { isPinned: !note.isPinned },
      })
    );
  };

  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        dispatch(
          fetchNotes({ category, search: value, page, limit: rowsPerPage })
        );
      }, 500),
    [category]
  );

  useEffect(() => {
    debounceSearch(search);
    return () => {
      debounceSearch.cancel();
    };
  }, [search]);

  useEffect(() => {
    dispatch(fetchNotes({ category, search, page, limit: rowsPerPage }));
  }, [category,page, rowsPerPage]);

console.log("total",total)
console.log("rowsPerPage",rowsPerPage)
console.log("page",page)
  
  return (
    <>
      <NoteDialog
        open={dialougeData.open}
        type={dialougeData.type}
        title={dialougeData.title}
        data={dialougeData.data}
        handleClose={() => {
          setDialougeData((old) => ({
            ...old,
            open: false,
          }));
        }}
      />

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", gap: 3 }}>
          <TextField
            size="small"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: 20 }}>
                    {search && (
                      <IconButton size="small" onClick={() => setSearch("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="ideas">Ideas</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() =>
              setDialougeData({
                open: true,
                type: "create",
                data: null,
                title: "Add Notes",
              })
            }
          >
            Add note
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" key={index}>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleTogglePin(row)}
                        color={row?.isPinned ? "primary" : "default"}
                      >
                        <PushPinIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell key={row.id}>{row?.title}</TableCell>

                    <TableCell key={row.id}>{row?.content}</TableCell>

                    <TableCell key={row.id}>{row?.category}</TableCell>

                    <TableCell key={row.id}>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell key={row.id}>
                      <IconButton
                        onClick={() => {
                          setDialougeData({
                            open: true,
                            type: "edit",
                            data: row,
                            title: "Edit Notes",
                          });
                        }}
                      >
                        <EditSquareIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={async () => {
                          const result = await confirmDeleteAlert({
                            title: "Delete Note?",
                            text: "This note will be permanently deleted",
                          });

                          if (result.isConfirmed) {
                            dispatch(deleteNote(row._id));
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </>
  );
}
