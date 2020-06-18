import React from 'react';
import Alerts from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from '../../redux/actions/alertActions';

const mapStateToProps = state => ({
    // returns this part of state from store as props for this component
    alerts: state.alert
});

const MyAlerts = ({ alerts, removeAlert }) => {

    const handleClose = (id) => {
        removeAlert(id);
    }

    return (
        (alerts && alerts.length > 0) && alerts.map(alert => (
            <Alerts
                key={alert.id}
                variant={`${alert.alertType}`}
                onClose={() => handleClose(alert.id)}
                dismissible
            >
                {alert.msg}
            </Alerts>
        )
        )
    )
}

MyAlerts.propTypes = {
    alerts: PropTypes.array.isRequired,
    removeAlert: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { removeAlert })(MyAlerts); 