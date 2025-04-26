/* eslint-disable import/no-default-export */
import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import signal from '../../shared/assets/mobile-assets/signal.png';
import voltameter from '../../shared/assets/mobile-assets/voltameter.png';
import { Row } from '../../zui';

@observer
class ZStatusBar extends React.Component {
  render(): ReactElement {
    return (
      <div style={styles.container}>
        <Row justify="space-between" style={styles.row}>
          <Row align="middle">
            <img src={signal} alt="" style={styles.img} />
            <label>Zion</label>
          </Row>
          <label style={styles.time}>8:28 PM</label>
          <Row align="middle">
            <label style={styles.batteryPercentage}>100%</label>
            <img src={voltameter} alt="" style={styles.batteryImg} />
          </Row>
        </Row>
      </div>
    );
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: { marginLeft: '5px', marginRight: '5px' },
  img: { width: '30px', height: '20px' },
  time: { fontSize: '12px' },
  batteryPercentage: { fontSize: '10px' },
  batteryImg: { width: '30px', height: '20px' },
};

export default ZStatusBar;
