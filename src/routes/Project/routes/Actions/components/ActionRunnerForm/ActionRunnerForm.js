import React from 'react'
import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import Button from '@material-ui/core/Button'
import { Field } from 'redux-form'
import { Link } from 'react-router'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import CollectionSearch from 'components/CollectionSearch'
import TabContainer from 'components/TabContainer'
import { databaseURLToProjectName } from 'utils'
import { paths } from 'constants'
import OutlinedSelect from 'components/OutlinedSelect'
import ActionInput from '../ActionInput'
import StepsViewer from '../StepsViewer'
import PrivateActionTemplates from '../PrivateActionTemplates'
import classes from './ActionRunnerForm.scss'

export const ActionRunnerForm = ({
  selectedTemplate,
  inputsExpanded,
  toggleSteps,
  stepsExpanded,
  projectId,
  toggleInputs,
  templateName,
  toggleTemplateEdit,
  selectActionTemplate,
  templateEditExpanded,
  project,
  environments,
  environmentsExpanded,
  toggleEnvironments,
  selectTab,
  selectedTab
}) => (
  <div className={classes.container}>
    <ExpansionPanel
      expanded={templateEditExpanded}
      onChange={toggleTemplateEdit}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.sectionHeader}>
          {templateName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="flex-column">
        <Typography paragraph>
          Run an action by selecting a template, filling in the template's
          configuation options, then clicking <strong>run action</strong>.
        </Typography>
        <div className={classes.tabs}>
          <Link to={paths.actionTemplates}>
            <Button color="primary" className={classes.button}>
              Create New Action Template
            </Button>
          </Link>
          <div className={classes.or}>
            <Typography className={classes.orFont}>
              or select existing
            </Typography>
          </div>
          <AppBar position="static">
            <Tabs value={selectedTab} onChange={selectTab} fullWidth>
              <Tab label="Public" />
              <Tab label="Private" />
            </Tabs>
          </AppBar>
          {selectedTab === 0 && (
            <TabContainer>
              <div className={classes.search}>
                <CollectionSearch
                  indexName="actionTemplates"
                  onSuggestionClick={selectActionTemplate}
                />
              </div>
            </TabContainer>
          )}
          {selectedTab === 1 && (
            <TabContainer>
              <PrivateActionTemplates onTemplateClick={selectActionTemplate} />
            </TabContainer>
          )}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    {selectedTemplate ? (
      <ExpansionPanel
        expanded={environmentsExpanded}
        onChange={toggleEnvironments}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Environments</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.inputs}>
          {selectedTemplate.environments ? (
            selectedTemplate.environments.map((input, index) => (
              <Field
                name={`environmentValues.${index}`}
                component={OutlinedSelect}
                fullWidth
                key={`Environment-${index}`}
                props={{
                  label: get(input, `name`) || `Environment ${index + 1}`
                }}
                inputProps={{
                  name: 'environment',
                  id: 'environment',
                  'data-test': 'environment-select'
                }}>
                {map(environments, (environment, envIndex) => (
                  <MenuItem
                    key={`Environment-Option-${environment.id}-${envIndex}`}
                    value={environment.id}
                    disabled={
                      environment.locked ||
                      (environment.readOnly && index === 1) ||
                      (environment.writeOnly && index === 0)
                    }
                    data-test="environment-option"
                    data-test-id={environment.id}>
                    <ListItemText
                      primary={environment.name || environment.id}
                      secondary={`${databaseURLToProjectName(
                        environment.databaseURL
                      )}${environment.locked ? ' - Locked' : ''}${
                        environment.readOnly ? ' - Read Only' : ''
                      }${environment.writeOnly ? ' - Write Only' : ''}`}
                    />
                  </MenuItem>
                ))}
              </Field>
            ))
          ) : (
            <div className="flex-row-center">No Environments</div>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ) : null}
    {selectedTemplate ? (
      <ExpansionPanel expanded={inputsExpanded} onChange={toggleInputs}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Inputs</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.inputs}>
          {selectedTemplate.inputs
            ? selectedTemplate.inputs.map((input, index) => (
                <ActionInput
                  key={`Input-${index}`}
                  name={`inputValues.${index}`}
                  inputs={selectedTemplate.inputs}
                  inputMeta={get(selectedTemplate.inputs, index)}
                  {...{ index, environments, projectId }}
                />
              ))
            : null}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ) : null}
    {selectedTemplate ? (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Steps</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={6}>
              {selectedTemplate && selectedTemplate.steps ? (
                <StepsViewer steps={selectedTemplate.steps} activeStep={0} />
              ) : null}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ) : null}
  </div>
)

ActionRunnerForm.propTypes = {
  project: PropTypes.object,
  selectTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.number,
  templateName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  toggleInputs: PropTypes.func.isRequired,
  toggleSteps: PropTypes.func.isRequired,
  selectActionTemplate: PropTypes.func.isRequired,
  toggleTemplateEdit: PropTypes.func.isRequired,
  inputsExpanded: PropTypes.bool.isRequired,
  environmentsExpanded: PropTypes.bool.isRequired,
  toggleEnvironments: PropTypes.func.isRequired,
  templateEditExpanded: PropTypes.bool.isRequired,
  stepsExpanded: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  environments: PropTypes.array
}

export default ActionRunnerForm
