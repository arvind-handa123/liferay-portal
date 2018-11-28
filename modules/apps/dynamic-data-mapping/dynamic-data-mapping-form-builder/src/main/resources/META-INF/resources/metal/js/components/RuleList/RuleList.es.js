import 'clay-button';
import {Config} from 'metal-state';
import {EventHandler} from 'metal-events';
import Component from 'metal-component';
import dom from 'metal-dom';
import Soy from 'metal-soy';
import templates from './RuleList.soy.js';
import {makeFetch} from '../../util/fetch.es';

/**
 * LayoutRenderer.
 * @extends Component
 */

class RuleList extends Component {

	static STATE = {
		dataProvider: Config.arrayOf(
			Config.shapeOf(
				{
					id: Config.string(),
					name: Config.string(),
					uuid: Config.string()
				}
			)
		).internal(),

		dataProviderInstancesURL: Config.string().required(),

		pages: Config.array().required(),

		/**
		 * @default 0
		 * @instance
		 * @memberof RuleList
		 * @type {?array}
		 */

		rules: Config.arrayOf(
			Config.shapeOf(
				{
					actions: Config.arrayOf(
						Config.shapeOf(
							{
								action: Config.string(),
								ddmDataProviderInstanceUUID: Config.string(),
								expression: Config.string(),
								inputs: Config.object(),
								label: Config.string(),
								outputs: Config.object(),
								target: Config.string()
							}
						)
					),
					conditions: Config.arrayOf(
						Config.shapeOf(
							{
								operands: Config.arrayOf(
									Config.shapeOf(
										{
											label: Config.string(),
											repeatable: Config.bool(),
											type: Config.string(),
											value: Config.string()
										}
									)
								),
								operator: Config.string()
							}
						)
					),
					['logical-operator']: Config.string()
				}
			)
		),

		/**
		 * @default undefined
		 * @instance
		 * @memberof RuleList
		 * @type {!string}
		 */

		spritemap: Config.string().required(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof RuleList
		 * @type {!string}
		 */

		strings: Config.object().value(
			{
				and: Liferay.Language.get('and'),
				'auto-fill': Liferay.Language.get('autofill-x-from-data-provider-x'),
				'belongs-to': Liferay.Language.get('belongs-to'),
				'calculate-field': Liferay.Language.get('calculate-field-x-as-x'),
				contains: Liferay.Language.get('contains'),
				delete: Liferay.Language.get('delete'),
				edit: Liferay.Language.get('edit'),
				emptyListText: Liferay.Language.get('there-are-no-rules-yet-click-on-plus-icon-below-to-add-the-first'),
				'enable-field': Liferay.Language.get('enable-x'),
				'equals-to': Liferay.Language.get('is-equal-to'),
				field: Liferay.Language.get('field'),
				fromDataProvider: Liferay.Language.get('from-data-provider'),
				'greater-than': Liferay.Language.get('is-greater-than'),
				'greater-than-equals': Liferay.Language.get('is-greater-than-or-equal-to'),
				if: Liferay.Language.get('if'),
				'is-empty': Liferay.Language.get('is-empty'),
				'jump-to-page': Liferay.Language.get('jump-to-page-x'),
				'less-than': Liferay.Language.get('is-less-than'),
				'less-than-equals': Liferay.Language.get('is-less-than-or-equal-to'),
				'not-contains': Liferay.Language.get('does-not-contain'),
				'not-equals-to': Liferay.Language.get('is-not-equal-to'),
				'not-is-empty': Liferay.Language.get('is-not-empty'),
				or: Liferay.Language.get('or'),
				'require-field': Liferay.Language.get('require-x'),
				rules: Liferay.Language.get('rules'),
				'show-field': Liferay.Language.get('show-x'),
				value: Liferay.Language.get('value')
			}
		)
	}

	_fetchDataProvider() {
		const {dataProviderInstancesURL} = this;

		makeFetch(
			{
				method: 'GET',
				url: dataProviderInstancesURL
			}
		).then(
			responseData => {
				if (!this.isDisposed()) {
					this.setState(
						{
							dataProvider: responseData.map(
								data => {
									return {
										...data,
										label: data.name,
										value: data.id
									};
								}
							)
						}
					);
				}
			}
		).catch(
			error => {
				throw new Error(error);
			}
		);
	}

	_getFieldLabel(fieldName) {
		const pages = this.pages;

		let fieldLabel;

		if (pages) {
			for (let page = 0; page < pages.length; page++) {
				const rows = pages[page].rows;

				for (let row = 0; row < rows.length; row++) {
					const cols = rows[row].columns;

					for (let col = 0; col < cols.length; col++) {
						const fields = cols[col].fields;

						for (let field = 0; field < fields.length; field++) {
							if (pages[page].rows[row].columns[col].fields[field].fieldName === fieldName) {
								fieldLabel = pages[page].rows[row].columns[col].fields[field].label;
								break;
							}
						}
					}
				}
			}
		}

		return fieldLabel;
	}

	_formatActions(actions) {
		actions.forEach(
			action => {
				action.label = this._getFieldLabel(action.target);

				const expression = action.expression;

				if (expression) {
					action.expression = expression.replace(/\[|\]/g, '');
				}
			}
		);

		return actions;
	}

	_getDataProviderName(id) {
		const {dataProvider} = this;

		return dataProvider.find(data => data.uuid == id).label;
	}

	_setRules(newRules) {
		for (let rule = 0; rule < newRules.length; rule++) {
			const actions = newRules[rule].actions;

			newRules[rule].actions = actions;

			actions.forEach(
				action => {
					if (action.action === 'auto-fill') {
						const inputValue = Object.values(action.inputs).map(fieldName => this._getFieldLabel(fieldName));

						action.inputValue = inputValue.toString();
						const outputValue = Object.values(action.outputs).map(fieldName => this._getFieldLabel(fieldName));

						action.outputValue = outputValue.toString();
					}
				}
			);

			let logicalOperator;

			if (newRules[rule]['logical-operator']) {
				logicalOperator = newRules[rule]['logical-operator'].toLowerCase();
				newRules[rule].logicalOperator = logicalOperator;

			}
			else if (newRules[rule].logicalOperator) {
				logicalOperator = newRules[rule].logicalOperator.toLowerCase();
				newRules[rule].logicalOperator = logicalOperator;
			}
		}

		return newRules;
	}

	_setDataProviderName() {
		const newRules = this.rules;

		if (this.dataProvider) {
			for (let rule = 0; rule < newRules.length; rule++) {
				const actions = newRules[rule].actions;

				actions.forEach(
					action => {
						if (action.action === 'auto-fill') {
							const dataProviderName = this._getDataProviderName(action.ddmDataProviderInstanceUUID);

							action.dataProviderName = dataProviderName;
						}
					}
				);
			}
			this.setState({rules: newRules});
		}
	}

	prepareStateForRender(states) {
		this._setDataProviderName();

		return {
			...states,
			rules: states.rules.map(
				rule => {
					return {
						...rule,
						actions: rule.actions.map(
							actionItem => {
								return {
									...actionItem,
									label: this._getFieldLabel(actionItem.target),
									target: this._getFieldLabel(actionItem.target)
								};
							}
						),
						conditions: rule.conditions.map(
							condition => {
								return {
									...condition,
									operands: condition.operands.map(
										operand => {
											return {
												...operand,
												value: this._setOperandValue(operand)
											};
										}
									)
								};
							}
						)
					};
				}
			)
		};
	}

	_setOperandValue(operand) {
		let field = '';

		if (operand.type === 'field' || operand.type != 'user') {
			field = this._getFieldLabel(operand.value);
		}
		else {
			field = operand.value;
		}

		if ((field != '') && (typeof (field) == 'undefined')) {
			field = operand.value;
		}

		return field;
	}

	created() {
		this._eventHandler = new EventHandler();

		this._fetchDataProvider();

		const newRules = this.rules;

		this._setRules(newRules);

		this.setState({rules: newRules});
	}

	attached() {
		this._eventHandler.add(
			dom.on('.rule-card-delete', 'click', this.deleteRule.bind(this))
		);
	}

	deleteRule(event) {
		const {delegateTarget} = event;
		const {cardId} = delegateTarget.dataset;

		this.emit(
			'ruleDeleted',
			{
				ruleId: cardId
			}
		);
	}
}

Soy.register(RuleList, templates);

export default RuleList;