import React from 'react';
import Moment from 'react-moment';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const bounty = item => {
  const description = item.displayProperties.description !== '' ? item.displayProperties.description : false;
  const displaySource = item.displaySource && item.displaySource !== '' ? item.displaySource : false;

  const instanceProgress = item.itemComponents && item.itemComponents.objectives;

  let objectives = [];
  let rewards = [];

  item.objectives &&
    item.objectives.objectiveHashes.forEach(element => {
      let definitionObjective = manifest.DestinyObjectiveDefinition[element];

      let defaults = {
        complete: false,
        progress: 0,
        objectiveHash: definitionObjective.hash
      };

      let progress = (instanceProgress && instanceProgress.find(o => o.objectiveHash === element)) || {};

      defaults = { ...defaults, ...progress };

      objectives.push(<ProgressBar key={definitionObjective.hash} objective={definitionObjective} progress={defaults} />);
    });

  item.value &&
    item.value.itemValue.forEach(value => {
      if (value.itemHash !== 0) {
        let definition = manifest.DestinyInventoryItemDefinition[value.itemHash];
        rewards.push(
          <li key={value.itemHash}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definition.displayProperties.icon}`} />
            <div className='text'>
              {definition.displayProperties.name}
              {value.quantity > 1 ? <> +{value.quantity}</> : null}
            </div>
          </li>
        );
      }
    });

  const nowMs = new Date().getTime();
  const expiry = item.itemComponents && item.itemComponents.item && item.itemComponents.item.expirationDate;
  const expiryMs = expiry && new Date(expiry).getTime();

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {objectives.length ? <div className='objectives'>{objectives}</div> : null}
      {displaySource ? (
        <div className='description'>
          <pre>{displaySource}</pre>
        </div>
      ) : null}
      {rewards.length ? (
        <div className='rewards'>
          <ul>{rewards}</ul>
        </div>
      ) : null}
      {instanceProgress && instanceProgress.filter(o => !o.complete).length > 0 && expiry ? (
        <div className='expiry'>
          {expiryMs > nowMs ? (
            <>
              Expires <Moment fromNow>{expiry}</Moment>.
            </>
          ) : (
            <>Expired.</>
          )}
        </div>
      ) : null}
    </>
  );
};

export default bounty;
