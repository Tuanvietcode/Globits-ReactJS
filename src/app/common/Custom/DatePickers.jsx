import 'date-fns';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker,
} from '@material-ui/pickers';

export default function DatePickers({
    onChange,
    value,
    isTime = true,
    labelDate = 'Select Date',
    format = 'MM/dd/yyyy',
    className,
}) {
    const [selectedDate, setSelectedDate] = useState(value || new Date());

    useEffect(() => {
        if (value) {
            setSelectedDate(value);
        }
    }, [value]);

    const handleDateChange = (date) => {
        if (!date) return;
        const updatedDate = new Date(selectedDate);
        updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(updatedDate);
        onChange(updatedDate);
    };

    const handleTimeChange = (time) => {
        if (!time) return;
        const updatedDate = new Date(selectedDate);
        updatedDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
        setSelectedDate(updatedDate);
        onChange(updatedDate);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid
                className={className}
                style={{
                    border: "1px solid #e4e4e4", borderRadius: "4px", padding: '8px'
                }}
            >
                
                <KeyboardDatePicker
                    label={labelDate}
                    format={format}
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    InputProps={{
                        disableUnderline: true,
                        style: { paddingLeft: '14px' },
                    }}
                    InputLabelProps={{
                        style: { paddingLeft: '14px' },
                    }}
                    style={{ width: '100%', marginBottom: '8px' }}
                />

                {isTime && (
                    <KeyboardTimePicker
                        label="Chọn giờ"
                        value={selectedDate}
                        onChange={handleTimeChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        InputProps={{
                            disableUnderline: true,
                            style: { paddingLeft: '14px' },
                        }}
                        style={{ width: '100%' }}
                    />
                )}
            </Grid>
        </MuiPickersUtilsProvider>
    );
}
