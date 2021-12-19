import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
//import Typography from "@material-ui/core";

const useStyles = makeStyles(() => ({
    styleText: { fontSize: 10 },
  }));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    styleText : {
        
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {
                onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                ) 
                : null
            }
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        height: "600px",
        width: "calc(100vw-40px)",
    },
    
}))(MuiDialogContent);

export default function CustomizedDialogs({ open, setOpen, title, contents }) {
    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography className={classes.styleText} gutterBottom>
                        <div dangerouslySetInnerHTML={{ __html: contents }} />
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
}