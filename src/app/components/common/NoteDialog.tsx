import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { MenuItem, TextField } from "@mui/material";
import { noteSchema } from "@/app/validation/note-validation";
import { createNote, updateNote } from "@/app/redux/slices/note-slice";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector ,useAppDispatch} from "@/app/redux/hooks";
import { NoteDialogProps } from "@/types/notes/note";

const NoteDialog = ({ open, title, data, handleClose, type }:NoteDialogProps) => {
  const dispatch = useAppDispatch();
const { loading } = useAppSelector((state) => state.note);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.title || "",
      content: data?.content || "",
      category: data?.category || "",
    },
    validationSchema: noteSchema,
    onSubmit: async (values) => {
      try {
        if (type === "create") {
          dispatch(createNote(values));
        }

        if (type === "edit") {
          dispatch(updateNote({ id: data._id, data: values }));
        }

        resetForm();
        handleClose();
      } catch (error) {
        console.error("Submit failed:", error);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && String(errors.title??"")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Content"
            name="content"
            multiline
            rows={4}
            value={values.content}
            onChange={handleChange}
            error={touched.content && Boolean(errors.content)}
            helperText={touched.content && String(errors.content)}
          />

          <TextField
            fullWidth
            select
            margin="normal"
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            error={touched.category && Boolean(errors.category)}
            helperText={touched.category && String(errors.category)}
          >
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="ideas">Ideas</MenuItem>
          </TextField>

          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button  type="submit" variant="contained" disabled={loading}>
              {type === "create" ? "Add Note" : "Update Note"}
            </Button>


            {/* <Button
  type="submit"
  variant="contained"
  disabled={loading}
>
  {loading ? (
    <CircularProgress size={22} color="inherit" />
  ) : (
    type === "create" ? "Add Note" : "Update Note"
  )}
</Button> */}

          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
