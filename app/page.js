'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(firestore, 'inventory'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
    };
    fetchData();
  }, []);

  const addItem = async (name) => {
    await setDoc(doc(collection(firestore, 'inventory')), { name, quantity: 1 });
    setInventory([...inventory, { name, quantity: 1 }]);
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(firestore, 'inventory', id));
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
      <Box
          width="100vw"
          height="100vh"
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
      >
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Box border={'1px solid #333'}>
          <Box
              width="800px"
              height="100px"
              bgcolor={'#ADD8E6'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {inventory.map(({ id, name, quantity }) => (
                <Box
                    key={id}
                    width="100%"
                    minHeight="150px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    bgcolor={'#f0f0f0'}
                    paddingX={5}
                >
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                  <Button variant="contained" onClick={() => removeItem(id)}>
                    Remove
                  </Button>
                </Box>
            ))}
          </Stack>
        </Box>
      </Box>
  );
}
