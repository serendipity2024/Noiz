import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { useRecordContext } from 'ra-core';

import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from 'ra-ui-materialui/lib/field/types';
import sanitizeFieldRestProps from 'ra-ui-materialui/lib/field/sanitizeFieldRestProps';

const useStyles = makeStyles(
    {
        list: {
            display: 'flex',
            flexWrap: 'wrap',
            listStyleType: 'none',
            padding: 0,
            margin: '0.5rem 0',
        },
        image: {
            margin: '0.5rem',
            maxHeight: '10rem',
        },
    },
    { name: 'RaImageListField' }
);

export interface ImageListFieldProps extends PublicFieldProps, InjectedFieldProps {
    src?: string;
    title?: string;
    classes?: object;
}

/**
 * A component to display a list of images
 * 
 * @example
 * <ImageListField source="pictures" src="url" title="title" />
 */
const ImageListField = (props: ImageListFieldProps) => {
    const {
        className,
        classes: classesOverride,
        emptyText,
        source,
        src,
        title,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const sourceValue = get(record, source);
    const classes = useStyles(props);

    if (!sourceValue || !Array.isArray(sourceValue) || sourceValue.length === 0) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : (
            <div className={className} {...sanitizeFieldRestProps(rest)} />
        );
    }

    return (
        <ul
            className={classnames(classes.list, className)}
            {...sanitizeFieldRestProps(rest)}
        >
            {sourceValue.map((item, index) => {
                const sourceImageValue = src ? get(item, src) : item;
                const sourceTitleValue = title ? get(item, title) : title;

                return (
                    <li key={index}>
                        <img
                            src={sourceImageValue}
                            alt={sourceTitleValue}
                            title={sourceTitleValue}
                            className={classes.image}
                        />
                    </li>
                );
            })}
        </ul>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
ImageListField.displayName = 'ImageListField';

ImageListField.defaultProps = {
    addLabel: true,
};

ImageListField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
};

export default ImageListField;
