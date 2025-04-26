import * as React from 'react';
import { FileInput, FileInputProps, FileInputOptions } from 'ra-ui-materialui';
import { makeStyles } from '@material-ui/core/styles';
import { InputProps } from 'ra-core';

const useStyles = makeStyles(
    {
        root: {},
        dropZone: {
            background: '#efefef',
            cursor: 'pointer',
            padding: '1rem',
            textAlign: 'center',
            color: '#999',
        },
        preview: {},
        removeButton: {
            display: 'inline-block',
            position: 'relative',
            float: 'left',
            '& button': {
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                minWidth: '2rem',
                opacity: 0,
            },
            '&:hover button': {
                opacity: 1,
            },
        },
    },
    { name: 'RaVideoInput' }
);

/**
 * A component for uploading videos
 * 
 * @example
 * <VideoInput source="video">
 *     <VideoField source="src" title="title" />
 * </VideoInput>
 */
const VideoInput = (props: VideoInputProps) => {
    const classes = useStyles(props);

    return (
        <FileInput
            labelMultiple="ra.input.video.upload_several"
            labelSingle="ra.input.video.upload_single"
            classes={classes}
            accept="video/*"
            {...props}
        />
    );
};

export type VideoInputProps = FileInputProps & InputProps<FileInputOptions>;

export default VideoInput;
