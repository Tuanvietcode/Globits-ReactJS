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
                    border: "1px solid #d1d1d1",
                    borderRadius: "8px",
                    padding: '12px',
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
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
                        style: {
                            padding: '10px',
                            borderRadius: '6px',
                            border: "1px solid #ccc",
                            backgroundColor: "#fafafa",
                            transition: "border-color 0.3s",
                        },
                        onFocus: (e) => e.target.style.border = "1px solid #3f51b5",
                        onBlur: (e) => e.target.style.border = "1px solid #ccc",
                    }}
                    InputLabelProps={{
                        style: { paddingLeft: '8px', fontWeight: "bold" },
                    }}
                    style={{ width: '100%' }}
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
                            style: {
                                padding: '10px',
                                borderRadius: '6px',
                                border: "1px solid #ccc",
                                backgroundColor: "#fafafa",
                                transition: "border-color 0.3s",
                            },
                            onFocus: (e) => e.target.style.border = "1px solid #3f51b5",
                            onBlur: (e) => e.target.style.border = "1px solid #ccc",
                        }}
                        style={{ width: '100%' }}
                    />
                )}
            </Grid>
        </MuiPickersUtilsProvider>
    );
}
