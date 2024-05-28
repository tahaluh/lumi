import React, { useState } from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, Button, Box } from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { UploadBills } from '../services/uploadBills';
import { useSnackbar } from 'notistack'

function AddBillModal({ open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleAddMoreFiles = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = handleFileChange;
        input.click();
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    const handleSave = async () => {
        const res = await UploadBills(selectedFiles)
        const { failed, succeeded } = res.data;
        console.log(res.data)
        if (res.error) {
            enqueueSnackbar(`${res.error}`, { variant: 'error' });
            return;
        }
        if (failed.length > 0) {
            enqueueSnackbar(`Erro ao importar ${failed.length} contas`, { variant: 'error' });
            failed.forEach(({ fileName }) => {
                enqueueSnackbar(`Erro ao importar ${fileName}`, { variant: 'error' });
            });
        }
        if (succeeded.length > 0) enqueueSnackbar(`Sucesso ao importar ${succeeded.length} contas`, { variant: 'success' });
        setSelectedFiles([]);
        onClose();
    };

    const handleCancel = () => {
        setSelectedFiles([]);
        onClose();
    };

    return (
        <Dialog onClose={handleCancel} open={open}>
            <DialogTitle>Selecionar PDFs</DialogTitle>
            <Box>
                <List>
                    {selectedFiles.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={file.name} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                    <DeleteOutline />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    <ListItem>
                        <ListItemText primary="Adicionar arquivos PDF" />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={handleAddMoreFiles}>
                                <AddCircleOutline />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Button color="error" variant='contained' onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave}>
                    Salvar
                </Button>
            </Box>
        </Dialog>
    );
}

export default AddBillModal;
