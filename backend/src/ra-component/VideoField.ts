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
        video: {
            maxHeight: '20rem',
            maxWidth: '100%',
        },
    },
    { name: 'RaVideoField' }
);

export interface VideoFieldProps extends PublicFieldProps, InjectedFieldProps {
    src?: string;
    title?: string;
    controls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    classes?: object;
}

/**
 * A component to display a video
 * 
 * @example
 * <VideoField source="video" src="url" title="title" />
 */
const VideoField = (props: VideoFieldProps) => {
    const {
        className,
        classes: classesOverride,
        emptyText,
        source,
        src,
        title,
        controls = true,
        autoPlay = false,
        loop = false,
        muted = false,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const sourceValue = get(record, source);
    const classes = useStyles(props);

    if (!sourceValue) {
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

    const sourceVideoValue = src ? get(record, src) : sourceValue;
    const sourceTitleValue = title ? get(record, title) : title;

    return (
        <div className={className} {...sanitizeFieldRestProps(rest)}>
            <video
                src={sourceVideoValue}
                title={sourceTitleValue}
                controls={controls}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                className={classnames(classes.video, className)}
            />
        </div>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
VideoField.displayName = 'VideoField';

VideoField.defaultProps = {
    addLabel: true,
    controls: true,
    autoPlay: false,
    loop: false,
    muted: false,
};

VideoField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
    controls: PropTypes.bool,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
};

export default VideoField;
