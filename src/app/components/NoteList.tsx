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
import { deleteNote, fetchNotes, updateNote } from "../redux/slices/note-slice";
import NoteDialog from "./common/NoteDialog";
import { Box, flex, Grid } from "@mui/system";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import debounce from "lodash.debounce";
import CloseIcon from "@mui/icons-material/Close";
import { Note } from "@/types/notes/note";
import {  RootState } from "@/types/notes/note-redux";
import { TableColumn } from "@/types/components/note-table";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { DialogState } from "@/types/components/note-dialouge";
import NoteCard from "./common/NoteCard";

const columns: TableColumn[] = [
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
  const [rowsPerPage, setRowsPerPage] = useState<number>(9);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const dispatch = useAppDispatch();
  const { notes, total } = useAppSelector((state: RootState) => state.note);
  const totalPages = Math.ceil(total / rowsPerPage);
  const [dialougeData, setDialougeData] = useState<DialogState>({
    open: false,
    type: "create",
    data: null,
    title: "",
  });

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(
          fetchNotes({ category, search: value, page, limit: rowsPerPage }),
        );
      }, 500),
    [category],
  );

  useEffect(() => {
    debounceSearch(search);
    return () => {
      debounceSearch.cancel();
    };
  }, [search]);

  useEffect(() => {
    dispatch(fetchNotes({ category, search, page, limit: rowsPerPage }));
  }, [category, page, rowsPerPage]);

  return (
    <Box sx={{ padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
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
      {/* <TableContainer sx={{ maxHeight: 440 }}>
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
              {notes.map((row: Note, index) => {
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
                    <TableCell>{row?.title}</TableCell>

                    <TableCell>{row?.content}</TableCell>

                    <TableCell>{row?.category}</TableCell>

                    <TableCell key={row?._id}>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell key={index}>
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
        /> */}

      <Typography>Pinned note</Typography>
      <Grid container spacing={2} sx={{ justifyContent: "start" }}>
        {notes
          .filter((note) => note.isPinned == true)
          .map((row: Note, index) => (
            <NoteCard
              row={row}
              index={index}
              dialougeData={dialougeData}
              setDialougeData={setDialougeData}
            />
          ))}
      </Grid>

      <Typography> Others</Typography>

      <Grid container spacing={2} sx={{ justifyContent: "start" }}>
        {notes
          .filter((note) => note.isPinned == false)
          .map((row: Note, index) => (
            <NoteCard
              row={row}
              index={index}
              dialougeData={dialougeData}
              setDialougeData={setDialougeData}
            />
          ))}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
