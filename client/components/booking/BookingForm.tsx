import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Validation schema
const validationSchema = yup.object({
  clientId: yup.string().required('Client is required'),
  studioId: yup.string().required('Studio is required'),
  startTime: yup.date().required('Start time is required'),
  endTime: yup
    .date()
    .required('End time is required')
    .min(yup.ref('startTime'), 'End time must be after start time'),
  engineerId: yup.string(),
  notes: yup.string().max(500, 'Notes must be less than 500 characters'),
  equipment: yup.array().of(yup.string()),
});

// Mock data - would come from API in real application
const clients = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Band XYZ' },
];

const studios = [
  { id: '1', name: 'Studio A' },
  { id: '2', name: 'Studio B' },
  { id: '3', name: 'Control Room' },
];

const engineers = [
  { id: '1', name: 'Emily Johnson' },
  { id: '2', name: 'Michael Rodriguez' },
  { id: '3', name: 'Sarah Lee' },
];

const equipmentList = [
  { id: '1', name: 'Neumann U87 Microphone' },
  { id: '2', name: 'SSL Console' },
  { id: '3', name: 'Drum Kit - Pearl Masters' },
  { id: '4', name: 'Gibson Les Paul' },
  { id: '5', name: 'Fender Jazz Bass' },
  { id: '6', name: 'AKG C414 Microphone' },
];

interface BookingFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
  isEditing?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  initialValues = {
    clientId: '',
    studioId: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // Default 3 hours later
    engineerId: '',
    notes: '',
    equipment: [],
  },
  isEditing = false,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Booking' : 'Create New Booking'}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            {/* Client Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.clientId && Boolean(formik.errors.clientId)}>
                <InputLabel id="client-label">Client</InputLabel>
                <Select
                  labelId="client-label"
                  id="clientId"
                  name="clientId"
                  value={formik.values.clientId}
                  onChange={formik.handleChange}
                  label="Client"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.clientId && formik.errors.clientId && (
                  <FormHelperText>{formik.errors.clientId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Studio Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.studioId && Boolean(formik.errors.studioId)}>
                <InputLabel id="studio-label">Studio</InputLabel>
                <Select
                  labelId="studio-label"
                  id="studioId"
                  name="studioId"
                  value={formik.values.studioId}
                  onChange={formik.handleChange}
                  label="Studio"
                >
                  {studios.map((studio) => (
                    <MenuItem key={studio.id} value={studio.id}>
                      {studio.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.studioId && formik.errors.studioId && (
                  <FormHelperText>{formik.errors.studioId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Start Time */}
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Start Time"
                value={formik.values.startTime}
                onChange={(newValue) => {
                  formik.setFieldValue('startTime', newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.startTime && Boolean(formik.errors.startTime),
                    helperText: formik.touched.startTime && formik.errors.startTime,
                  },
                }}
              />
            </Grid>

            {/* End Time */}
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="End Time"
                value={formik.values.endTime}
                onChange={(newValue) => {
                  formik.setFieldValue('endTime', newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.endTime && Boolean(formik.errors.endTime),
                    helperText: formik.touched.endTime && formik.errors.endTime,
                  },
                }}
              />
            </Grid>

            {/* Engineer Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="engineer-label">Engineer (Optional)</InputLabel>
                <Select
                  labelId="engineer-label"
                  id="engineerId"
                  name="engineerId"
                  value={formik.values.engineerId}
                  onChange={formik.handleChange}
                  label="Engineer (Optional)"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {engineers.map((engineer) => (
                    <MenuItem key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Equipment Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="equipment-label">Equipment (Optional)</InputLabel>
                <Select
                  labelId="equipment-label"
                  id="equipment"
                  name="equipment"
                  multiple
                  value={formik.values.equipment}
                  onChange={formik.handleChange}
                  label="Equipment (Optional)"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const equipment = equipmentList.find((e) => e.id === value);
                        return equipment ? (
                          <Chip key={value} label={equipment.name} />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {equipmentList.map((equipment) => (
                    <MenuItem key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => formik.resetForm()}>
                  Reset
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {isEditing ? 'Update Booking' : 'Create Booking'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </form>
    </Paper>
  );
};

export default BookingForm;