import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import { useRecordContext } from 'ra-core';
import { TypographyProps } from '@material-ui/core/Typography';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from 'ra-ui-materialui/lib/field/types';
import sanitizeFieldRestProps from 'ra-ui-materialui/lib/field/sanitizeFieldRestProps';

/**
 * Display a time value as a locale string.
 *
 * Uses Intl.DateTimeFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs time as is (and ignores the locales and options props).
 *
 * @example
 * <TimeField source="created_at" />
 * // renders the time part of the record { id: 1234, created_at: new Date('2022-01-01T14:30:00') } as
 * <span>14:30</span>
 *
 * <TimeField source="created_at" options={{ hour: '2-digit', minute: '2-digit', second: '2-digit' }} />
 * // renders the time part of the record { id: 1234, created_at: new Date('2022-01-01T14:30:45') } as
 * <span>02:30:45 PM</span>
 *
 * <TimeField source="created_at" locales="fr-FR" options={{ hour: '2-digit', minute: '2-digit', second: '2-digit' }} />
 * // renders the time part of the record { id: 1234, created_at: new Date('2022-01-01T14:30:45') } as
 * <span>14:30:45</span>
 */
export const TimeField: React.FC<TimeFieldProps> = (props) => {
    const {
        className,
        emptyText,
        locales,
        options = {
            hour: '2-digit',
            minute: '2-digit',
        },
        source,
        ...rest
    } = props;
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    const value = get(record, source);
    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : null;
    }

    const date = value instanceof Date ? value : new Date(value);
    const timeString = Intl.DateTimeFormat && typeof Intl.DateTimeFormat === 'function'
        ? new Intl.DateTimeFormat(locales, options).format(date)
        : date.toLocaleTimeString();

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {timeString}
        </Typography>
    );
};

TimeField.displayName = 'TimeField';

TimeField.defaultProps = {
    addLabel: true,
};

TimeField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
};

export interface TimeFieldProps extends PublicFieldProps, InjectedFieldProps, TypographyProps {
    locales?: string | string[];
    options?: object;
}

export default TimeField;
