import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import TrackingUrl from 'tracking-url';

import { setUser, updateTrackingRecords, toggleEditing, updateNote, deleteTrackingRecord } from '../actions/actions';

const initialState = {
  url: null,
  status: null,
  errors: null,
  showCarrierPrompt: false,
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.trackingInput = null;
    this.noteInput = null;
  }

  componentDidMount() {
    this.getTrackingRecords();
  }

  resetFormState() {
    this.setState({
      trackingInput: "",
      noteInput: "",
      url: null,
      status: null,
      errors: null,
      showCarrierPrompt: false,
    });
  }

  getTrackingRecords() {
    fetch(`/tracking_records?token=${this.props.currentUser.token}`)
    .then(res =>
      res.json()
    )
    .then(data => {
      console.log(data.tracking_records);
      this.props.updateTrackingRecords(data.tracking_records);
    })
    .catch(err =>
      console.log(err.message)
    );
  }

  deleteTrackingRecord(e, recordIndex) {
    e.preventDefault();
    fetch(`/tracking_records/${this.props.trackingRecords[recordIndex].id}?token=${this.props.currentUser.token}`, { method: 'DELETE' })
    .then(() => {
      this.props.deleteTrackingRecord(recordIndex);
    })
    .catch(err =>
      console.log(err.message)
    );
  }

  addTrackingNum(e, trackingNum, note, forceCarrier) {
    e.preventDefault();
    this.resetFormState();
    if (forceCarrier) {
      this.submitTrackingNum(e, trackingNum, note, forceCarrier);
    } else {
      let trackingUrl = TrackingUrl(trackingNum);
      if (!!trackingUrl) {
        this.submitTrackingNum(e, trackingNum, note, trackingUrl.name);
      } else {
        this.setState({
          errors: 'cannot detect this tracking number, please choose a carrier from the list below',
          showCarrierPrompt: true,
        });
      }
    }
  }

  buildTrackingUrl(trackingNum, carrier) {
    switch (carrier) {
      case 'fedex':
        return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
      case 'usps':
        return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNum}`;
      case 'ups':
        return `https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=${trackingNum}`;
      default:
        return null;
    }
  }

  submitTrackingNum(e, trackingNum, note, carrier) {
    e.preventDefault();
    fetch(`/tracking_records`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNum,
          carrier,
          note,
          token: this.props.currentUser.token,
        }),
      }
    )
    .then(res =>
      res.json()
    )
    .then(data =>
      this.setState({
        status: data.tracking_info.status,
        url: this.buildTrackingUrl(trackingNum, carrier),
      })
    )
    .catch(err =>
      this.setState({ errors: err.message })
    );
    this.getTrackingRecords();
  }

  toggleEditing(e, recordIndex) {
    e.preventDefault();
    this.props.toggleEditing(recordIndex);
  }

  editNote(e, recordIndex, noteContent) {
    e.preventDefault();
    fetch(`/tracking_records/${this.props.trackingRecords[recordIndex].id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: noteContent,
          token: this.props.currentUser.token,
        }),
      }
    )
    .then(res => {
      this.props.toggleEditing(recordIndex);
      this.props.updateNote(recordIndex, noteContent);
    })
    .catch(err =>
      this.setState({ errors: err.message })
    );
  }

  render () {
    let { currentUser, trackingRecords } = this.props;
    return (
      <div>
        <div>{ currentUser.username }</div>
        <Link to="/" onClick={() => {
          this.props.setUser(null);
        }}>
          Signout
        </Link>

        <form onSubmit={ e => this.addTrackingNum(e, this.trackingInput.value, this.noteInput.value) }>
          <label>
            tracking number:
            <input
              value={this.state.trackingInput}
              name="tracking-num"
              ref={ input => this.trackingInput=input }
              onChange={ () => this.setState({trackingInput: this.value})}
            />
            <input
              value={this.state.noteInput}
              name="tracking-note"
              ref={ input => this.noteInput=input }
              onChange={ () => this.setState({noteInput: this.value})}
            />
          </label>
          <input type="submit" value="Add" />
        </form>

        { !!this.state.status &&
          <div>
            <a href={this.state.url}>{ this.state.trackingInput }</a>
            { this.state.status }
          </div>
        }
        { this.state.showCarrierPrompt &&
          <div>
            { this.state.errors }
            choose a carrier
            <a
              href="#"
              onClick={e => this.submitTrackingNum(e, this.state.trackingNum, this.state.noteInput, 'fedex')}
            >
              FedEx
            </a>
            <a
              href="#"
              onClick={e => this.submitTrackingNum(e, this.state.trackingNum, this.state.noteInput, 'usps')}
            >
              USPS
            </a>
            <a href="#"
               onClick={e => this.submitTrackingNum(e, this.state.trackingNum, this.state.noteInput, 'ups')}
            >
              UPS
            </a>
          </div>
        }
        { !!trackingRecords &&
          <ul>
            { trackingRecords.map((record, index) =>
                <li key={record.id}>
                  <a href={this.buildTrackingUrl(record.tracking_num, record.carrier)}>
                    { record.tracking_num }
                  </a>
                  { record.note }
                  { record.tracking_info &&
                    <div>
                      <div>
                        {record.tracking_info.status}
                      </div>
                      <div>
                        {record.estimate}
                      </div>
                    </div>
                  }
                  { !record.editing_status &&
                    <a href="#" onClick={e => this.toggleEditing(e, index)}>Edit</a>
                  }
                  {
                    !!record.editing_status &&
                    <div>
                      <form onSubmit={e => this.editNote(e, index, this.noteInput.value)}>
                        <label>
                          note:
                          <input
                            defaultValue={record.note}
                            name="tracking-note"
                            ref={ input => { this.noteInput = input; } }
                          />
                        </label>
                        <input type="submit" value="Save" />
                      </form>
                      <button onClick={e => this.toggleEditing(e, index)}>Cancel</button>
                    </div>
                  }
                  <a href="#" onClick={e => this.deleteTrackingRecord(e, index)}>Delete</a>
                </li>
              )
            }
          </ul>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  trackingRecords: state.trackingRecords,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({ setUser, toggleEditing, updateTrackingRecords, updateNote, deleteTrackingRecord }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
