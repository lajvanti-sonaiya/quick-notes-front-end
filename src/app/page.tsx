import { Box, Button, Typography } from '@mui/material';
import NoteList from "./components/NoteList";

export default function Home() {
  return (
<>
<Box sx={{display:"flex", flexDirection:"column",alignItems:"center", gap:2}}>
  <Typography variant="h3" >Quick Notes</Typography>
 <NoteList/>
</Box>
     
</>
  );
}
