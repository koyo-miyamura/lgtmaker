import React from "react";
import { Button, Paper, Grid, Typography, TextField, Box } from "@material-ui/core";

function InputUrl(props) {
  return (
    <Box mb={2}>
      <Paper variant="outlined" elevation={3} square>
        <Grid container>
          <Grid item sm={10} xs={9}>
            <TextField inputRef={props.inputRef} label="URL" placeholder="URL" variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={2} xs={3}>
            <Button color="primary" style={{ height: "100%" }} onClick={props.onSubmit} fullWidth>
              <Typography variant="button" style={{ textTransform: "none" }}>
                Submit
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default InputUrl;
