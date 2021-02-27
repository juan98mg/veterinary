import React, { forwardRef, useEffect, useState } from "react";
// Material
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import PetsRoundedIcon from "@material-ui/icons/PetsRounded";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Alert from '@material-ui/lab/Alert';
// Lodash
import { size, isEmpty } from "lodash";
// Custom code
import { addDocument, collections, deleteDocumentByID, getCollection } from "./actions";
import "./App.css";
import NoPets from "./NoPets";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function App() {
  // Form Init Values
  const setInitFormFields = () => {
    return {
      name: "",
      type: "",
      breed: "",
      birthDate: new Date().toISOString(),
      owner: {
        name: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
      },
    };
  };
  // Use State Hook
  const [petModal, setPetModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pets, setPets] = useState([]);
  const [pet, setPet] = useState(setInitFormFields());
  const [error, setError] = useState('');
  const [petID, setPetID] = useState('');

  // Use Effect Hook
  useEffect(() => {
    (async () => {
      const result = await getCollection(collections?.PETS);
      if (result?.status) {
        console.log([...result?.data]);
        setPets([...result?.data]);
      }
    })();
  }, []);

  const getDateWithFormat = ({ birthDate }) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}-${month + 1}-${year}`;
  };

  // Form Modal
  const openPetFormModal = () => {
    setPetModal(true);
    setPet(setInitFormFields());
  };

  const closePetFormModal = () => {
    setPetModal(false);
    setPet(setInitFormFields());
    setError('');
  };

  // Confirm Modal
  const openDeletePetModal = ({id}) => {
    setPetID(id);
    setDeleteModal(true);
  };
  const closeDeletePetModal = () => {
    setPetID('');
    setDeleteModal(false);
  };

  // PET FORM
  const isFormValid = () => {
    const petProperties = [...Object.getOwnPropertyNames(pet)];
    const ownerProperties = [...Object.getOwnPropertyNames(pet.owner)];

    petProperties.pop();

    const hasEmptyPetFields = petProperties.some((key) => isEmpty(pet[key]));
    const hasEmptyOwnerFields = ownerProperties.some((key) => isEmpty(pet.owner[key]));

    return hasEmptyPetFields || hasEmptyOwnerFields ? false : true;
  };

  const handleAddPetForm = async () => {
    if (!isFormValid()) {
      setError('All the form fields are required to create a pet!');
      return;
    }
    const result = await addDocument({
      collection: collections?.PETS, data: { ...pet }
    });

    if (!result.status) {
      setError(result.error);
      return;
    }
    const { id } = result?.data;
    setPets([...pets, { ...pet, id }]);
    closePetFormModal();
  };

  const handleEditPetForm = () => {
    
  };

  const handleDeletePet = async () => {
    const result = await deleteDocumentByID({ collection: collections?.PETS, id: petID });
    if (!result?.status) {
      setError(result?.error);
      return;
    }
    const newPets = pets.filter((p) => p.id !== petID);
    setPets([...newPets]);
    closeDeletePetModal();
  };

  const handlePetFormField = ({ key, value }) => {
    setPet({ ...pet, [key]: value });
    setError('');
  };
  const handleOwnerFormField = ({ key, value }) => {
    setPet({
      ...pet,
      owner: {
        ...pet.owner,
        [key]: value,
      },
    });
  };
  const handlePetBirthDate = (date) => {
    const birthDate = date.toISOString();
    setPet({ ...pet, birthDate });
  };

  return (
    <div className="vet">
      <header className="vet__header">
        <h1 className="vet__header-title">Veterinary App</h1>
        <div className="vet__header-add">
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={openPetFormModal}
            startIcon={<AddCircleOutlineIcon />}
          >
            Pet
          </Button>
          <Dialog
            open={petModal}
            keepMounted
            fullWidth
            maxWidth="xs"
            className="dialog"
            TransitionComponent={Transition}
            onClose={closePetFormModal}
            id='add-pet-form'
            aria-labelledby="Add a new pet">
            <DialogTitle className="dialog__title">
              {"Add a new Pet"}
            </DialogTitle>
            <DialogContent>
              { error && <Alert variant="outlined" severity="error">{error}!</Alert> }
              <TextField
                autoFocus
                margin="dense"
                id="pet-name"
                label="Pet name"
                type="text"
                value={pet.name}
                onChange={(e) =>
                  handlePetFormField({
                    key: "name",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="pet-type"
                label="Pet type"
                type="text"
                value={pet.type}
                onChange={(e) =>
                  handlePetFormField({
                    key: "type",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="pet-breed"
                label="Pet breed"
                type="text"
                value={pet.breed}
                onChange={(e) =>
                  handlePetFormField({
                    key: "breed",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Pet birth date"
                  value={pet.birthDate}
                  fullWidth
                  onChange={handlePetBirthDate}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                autoFocus
                margin="dense"
                id="owner-name"
                label="Owner name"
                type="text"
                value={pet.owner.name}
                onChange={(e) =>
                  handleOwnerFormField({
                    key: "name",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="owner-lastName"
                label="Owner last name"
                type="text"
                value={pet.owner.lastName}
                onChange={(e) =>
                  handleOwnerFormField({
                    key: "lastName",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="owner-email"
                label="Owner email"
                type="email"
                value={pet.owner.email}
                onChange={(e) =>
                  handleOwnerFormField({
                    key: "email",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="owner-address"
                label="Owner address"
                type="text"
                value={pet.owner.address}
                onChange={(e) =>
                  handleOwnerFormField({
                    key: "address",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="owner-phoneNumber"
                label="Owner phone number"
                type="tel"
                value={pet.owner.phoneNumber}
                onChange={(e) =>
                  handleOwnerFormField({
                    key: "phoneNumber",
                    value: e.target.value,
                  })
                }
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closePetFormModal} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddPetForm} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog 
            open={deleteModal}
            keepMounted
            fullWidth
            maxWidth="xs"
            className="dialog"
            TransitionComponent={Transition}
            onClose={closePetFormModal}
            aria-labelledby="Delete a Pet"
            id='delete-pet-confirm'>
            <DialogTitle className="dialog__title">
              {"Confirm"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the pet with ID: {petID} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeletePetModal} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeletePet} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </header>
      <section className="vet__pets">
        {size(pets) > 0 ? (
          pets.map((pet, index) => {
            const { id, name, breed, birthDate, type, owner } = pet;
            const {
              name: firstName,
              lastName,
              email,
              address,
              phoneNumber,
            } = owner;
            return (
              <div className="card" key={index}>
                <div className="pet">
                  <div className="pet__avatar">
                    <PetsRoundedIcon />
                  </div>
                  <div className="pet__name">{name}</div>
                  <div className="pet__type">
                    <span>Type:</span> {type}
                  </div>
                  <div className="pet__breed">
                    <span>Breed:</span> {breed}
                  </div>
                  <div className="pet__birthDate">
                    <span>Birth date:</span> {getDateWithFormat({ birthDate })}
                  </div>
                </div>
                <hr></hr>
                <h3 className="pet__owner-title">Owner</h3>
                <div className="pet__owner">
                  <div className="pet__owner-name">
                    <span>Name:</span> {firstName}
                  </div>
                  <div className="pet__owner-lastName">
                    <span>Last Name:</span> {lastName}
                  </div>
                  <div className="pet__owner-email">
                    <span>Email:</span> {email}
                  </div>
                  <div className="pet__owner-address">
                    <span>Address:</span> {address}
                  </div>
                  <div className="pet__owner-phoneNumber">
                    <span>Phone number:</span> {phoneNumber}
                  </div>
                </div>
                <hr></hr>
                <div className="pet__actions">
                  <Button variant="contained" startIcon={<EditOutlinedIcon />}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openDeletePetModal({id})}
                    startIcon={<DeleteForeverOutlinedIcon />}>
                    Delete
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <NoPets></NoPets>
        )}
      </section>
    </div>
  );
}
