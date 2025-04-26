import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';
import { TextFieldProps } from '@material-ui/core/TextField';
import InputHelperText from 'ra-ui-materialui/lib/input/InputHelperText';
import sanitizeInputRestProps from 'ra-ui-materialui/lib/input/sanitizeInputRestProps';

/**
 * Convert a time string without timezone to a date object
 * 
 * @param {string} value Time string in the form of HH:MM or HH:MM:SS
 * @returns {Date} Date object
 */
const parseTime = (value: string) => {
    if (!value) return null;
    
    // Create a date object for today with the time from the input
    const today = new Date();
    const [hours, minutes, seconds] = value.split(':').map(Number);
    
    today.setHours(hours || 0);
    today.setMinutes(minutes || 0);
    today.setSeconds(seconds || 0);
    
    return today;
};

/**
 * Convert a date object to a time string
 * 
 * @param {Date} value Date object
 * @returns {string} Time string in the form of HH:MM:SS
 */
const formatTime = (value: Date) => {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
        return '';
    }
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
};

/**
 * Input component for entering a time, using the browser locale
 */
const TimeInput = ({
    defaultValue,
    format = formatTime,
    initialValue,
    label,
    helperText,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    options,
    source,
    resource,
    parse = parseTime,
    validate,
    variant = 'filled',
    ...rest
}: TimeInputProps) => {
    const {
        id,
        input,
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        defaultValue,
        format,
        initialValue,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'time',
        validate,
        ...rest,
    });

    return (
        <TextField
            id={id}
            {...input}
            variant={variant}
            error={!!(touched && (error || submitError))}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
                    helperText={helperText}
                />
            }
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            margin={margin}
            type="time"
            InputLabelProps={{
                shrink: true,
            }}
            {...options}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

TimeInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

TimeInput.defaultProps = {
    options: {},
};

export interface TimeInputProps extends InputProps<TextFieldProps>, Omit<TextFieldProps, 'label' | 'helperText' | 'onChange' | 'onBlur' | 'onFocus' | 'defaultValue'> {
}

export default TimeInput;
