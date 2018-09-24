import 'clay-button';
import {Config} from 'metal-state';
import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './RuleEditor.soy.js';
import {PagesVisitor} from '../../util/visitors.es';
import {makeFetch} from '../../util/fetch.es';

/**
 * RuleEditor.
 * @extends URLEncodedFetcher
 */

class RuleEditor extends Component {
	static STATE = {

		/**
		 * @default 0
		 * @instance
		 * @memberof RuleList
		 * @type {?array}
		 */

		actions: Config.arrayOf(
			Config.shapeOf(
				{
					action: Config.string(),
					expression: Config.string(),
					label: Config.string(),
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
		).value([{operands: [{type: '', value: ''}], operator: ''}]),

		conditionTypes: Config.array(),

		firstOperandList: Config.arrayOf(
			Config.shapeOf(
				{
					dataType: Config.string(),
					name: Config.string(),
					options: Config.arrayOf(
						Config.shapeOf(
							{
								label: Config.string(),
								name: Config.string(),
								value: Config.string()
							}
						)
					),
					type: Config.string(),
					value: Config.string()
				}
			)
		),

		fixedOptions: Config.arrayOf(
			Config.shapeOf(
				{
					dataType: Config.string(),
					name: Config.string(),
					options: Config.arrayOf(
						Config.shapeOf(
							{
								label: Config.string(),
								value: Config.string()
							}
						)
					),
					type: Config.string(),
					value: Config.string()
				}
			)
		).value(
			[
				{
					dataType: 'user',
					label: 'user',
					name: 'user',
					value: Liferay.Language.get('user')
				}
			]
		),

		functionsMetadata:
			Config.shapeOf(
				{
					number: Config.arrayOf(
						Config.shapeOf(
							{
								label: Config.string(),
								name: Config.string(),
								parameterTypes: Config.array(),
								returnType: Config.string()
							}
						)
					),
					text: Config.arrayOf(
						Config.shapeOf(
							{
								label: Config.string(),
								name: Config.string(),
								parameterTypes: Config.array(),
								returnType: Config.string()
							}
						)
					),
					user: Config.arrayOf(
						Config.shapeOf(
							{
								label: Config.string(),
								name: Config.string(),
								parameterTypes: Config.array(),
								returnType: Config.string()
							}
						)
					)
				}
			),

		indexCondition: Config.string(),

		logicalOperator: Config.string().value('or'),

		operatorsList: Config.arrayOf(
			Config.shapeOf(
				{
					label: Config.string(),
					type: Config.string()
				}
			)
		),

		pages: Config.array().required(),

		readOnly: Config.bool().value(false),

		roles: Config.arrayOf(
			Config.shapeOf(
				{
					id: Config.string(),
					name: Config.string()
				}
			)
		),

		secondOperandTypeList: Config.arrayOf(
			Config.shapeOf(
				{
					name: Config.string(),
					value: Config.string()
				}
			)
		).value(
			[
				{
					value: Liferay.Language.get('value')
				},
				{
					name: 'field',
					value: Liferay.Language.get('other-field')
				}
			]
		),

		secondOperandTypeSelectedList: Config.arrayOf(
			Config.shapeOf(
				{
					id: Config.string(),
					name: Config.string(),
					value: Config.string()
				}
			)
		).value([{name: '', value: ''}]),

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

		strings: {
			value: {
				actions: Liferay.Language.get('actions'),
				and: Liferay.Language.get('and'),
				autofill: Liferay.Language.get('autofill'),
				calculate: Liferay.Language.get('calculate'),
				cancel: Liferay.Language.get('cancel'),
				chooseAnOption: Liferay.Language.get('choose-an-option'),
				condition: Liferay.Language.get('condition'),
				delete: Liferay.Language.get('delete'),
				deleteCondition: Liferay.Language.get('delete-condition'),
				deleteConditionQuestion: Liferay.Language.get('are-you-sure-you-want-to-delete-this-condition'),
				description: Liferay.Language.get('define-condition-and-action-to-change-fields-and-elements-on-the-form'),
				dismiss: Liferay.Language.get('dismiss'),
				do: Liferay.Language.get('do'),
				enable: Liferay.Language.get('enable'),
				if: Liferay.Language.get('if'),
				jumpToPage: Liferay.Language.get('jump-to-page'),
				or: Liferay.Language.get('or'),
				otherField: Liferay.Language.get('other-field'),
				require: Liferay.Language.get('require'),
				save: Liferay.Language.get('save'),
				show: Liferay.Language.get('show'),
				the: Liferay.Language.get('the'),
				title: Liferay.Language.get('rule'),
				user: Liferay.Language.get('user'),
				value: Liferay.Language.get('value')
			}
		},

		url: Config.string().required(),

		visibleModal: Config.bool().value(false)
	}

	attached() {
		const addButton = document.querySelector('#addFieldButton');

		if (addButton) {
			addButton.classList.add('hide');
		}
	}

	created() {
		this._fetchRoles();

		this.setState(
			{
				firstOperandList: this._getFieldsData()
			}
		);
	}

	_clearAllFieldsValues(index) {
		let copyOfConditions = this.conditions;

		let copyOfSecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

		copyOfConditions = this._clearOperatorValue(copyOfConditions, index);
		copyOfConditions = this._clearFirstOperandValue(copyOfConditions, index);
		copyOfSecondOperandTypeSelectedList = this._clearTypeSelected(copyOfSecondOperandTypeSelectedList, index);
		copyOfConditions = this._clearSecondOperandValue(copyOfConditions, index);

		this.setState(
			{
				conditions: copyOfConditions,
				secondOperandTypeSelectedList: copyOfSecondOperandTypeSelectedList
			}
		);
	}

	_clearFirstOperandValue(copyOfConditions, index) {
		if (copyOfConditions[index].operands[0]) {
			copyOfConditions[index].operands[0].type = '';
			copyOfConditions[index].operands[0].value = '';
		}

		return copyOfConditions;
	}

	_clearOperatorValue(copyOfConditions, index) {
		copyOfConditions[index].operator = '';

		return copyOfConditions;
	}

	_clearSecondOperandValue(copyOfConditions, index) {
		if (copyOfConditions[index].operands[1]) {
			copyOfConditions[index].operands[1].type = '';
			copyOfConditions[index].operands[1].value = '';
		}

		return copyOfConditions;
	}

	_clearTypeSelected(copyOfSecondOperandTypeSelectedList, index) {
		if (copyOfSecondOperandTypeSelectedList[index]) {
			copyOfSecondOperandTypeSelectedList[index].name = '';
			copyOfSecondOperandTypeSelectedList[index].value = '';
		}

		return copyOfSecondOperandTypeSelectedList;
	}

	_fetchRoles() {
		const {url} = this;

		makeFetch(
			{
				method: 'GET',
				url
			}
		).then(
			responseData => {
				this._pendingRequest = null;

				this.setState(
					{
						roles: responseData.map(
							data => {
								return {
									...data,
									value: data.name
								};
							}
						)
					}
				);
			}
		);
	}

	_fieldHasOptions(field) {
		return field === 'select' || field === 'radio' || field === 'checkbox_multiple';
	}

	_getConditionIndex({delegateTarget}, fieldClass) {
		const firstOperand = delegateTarget.closest(fieldClass);

		return firstOperand.getAttribute(`${fieldClass.substring(1)}-index`);
	}

	_getFieldsData() {
		const fieldData = [];
		const pages = this.pages;
		const visitor = new PagesVisitor(pages);

		visitor.mapFields(
			field => {
				fieldData.push(
					{
						...field,
						name: field.fieldName,
						options: field.options.map(
							option => {
								return {
									...option,
									name: option.value
								};
							}
						),
						value: field.label
					}
				);
			}
		);

		return fieldData;
	}

	_getFieldType(fieldName) {
		let fieldType = '';

		if (fieldName === 'user') {
			fieldType = 'user';
		}
		else {
			const selectedField = this.firstOperandList.filter(
				field => {
					return field.name === fieldName;
				}
			);

			if (selectedField.length > 0) {
				fieldType = selectedField[0].type;
			}
		}

		return fieldType;
	}

	_getMetaDataName(firstOperandType, fieldName) {
		const metaData = this.functionsMetadata[firstOperandType];

		let name = '';

		const selectedField = metaData.filter(
			field => {
				return field.label === fieldName;
			}
		);

		if (selectedField.length > 0) {
			name = selectedField[0].name;
		}

		return name;
	}

	_getOperatorsByFieldType(type) {
		const fieldType = this._setType(type);

		return this.functionsMetadata[fieldType].map(
			metadata => {
				return {
					...metadata,
					value: metadata.label
				};
			}
		);
	}

	_handleAddNewCondition() {
		const newCondition = {operands: [{type: '', value: ''}], operator: ''};

		const newOperandTypeSelected = {id: '', name: '', value: ''};

		const copyOfConditions = this.conditions;

		copyOfConditions.push(newCondition);

		const copyOfSecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

		copyOfSecondOperandTypeSelectedList.push(newOperandTypeSelected);

		this.setState(
			{
				conditions: copyOfConditions,
				secondOperandTypeSelectedList: copyOfSecondOperandTypeSelectedList
			}
		);
	}

	_handleDeleteCondition(event) {
		const {currentTarget} = event;

		const index = currentTarget.getAttribute('data-index');

		this.setState(
			{
				indexCondition: index,
				visibleModal: true
			}
		);
	}

	_handleFirstOperandSelection(event) {
		const {originalEvent, value} = event;

		const fieldName = originalEvent.target.getAttribute('data-option-value');

		const index = this._getConditionIndex(originalEvent, '.condition-if');

		let operators = [];

		let type = '';

		let previousFirstOperandType = '';

		if (fieldName) {
			type = this._getFieldType(fieldName);

			operators = this._getOperatorsByFieldType(type);
		}
		else {
			this._clearAllFieldsValues(index);
		}

		const operandSelected = {type, value};

		const copyOfConditions = this.conditions;

		if (this.conditions.length === 0) {
			const operands = [];

			operands.push(operandSelected);

			copyOfConditions.push({operands});

		}
		else {
			const previousFirstOperandValue = copyOfConditions[index].operands[0].value;
			previousFirstOperandType = copyOfConditions[index].operands[0].type;

			if (previousFirstOperandValue !== value) {
				copyOfConditions[index].operands[0] = operandSelected;
				copyOfConditions[index].operator = '';
			}
		}

		const copyOfsecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

		if (previousFirstOperandType !== type) {
			const resetedConditionType = {id: index, name: '', value: ''};

			copyOfsecondOperandTypeSelectedList[index] = resetedConditionType;
		}

		this.setState(
			{
				conditions: copyOfConditions,
				operatorsList: operators,
				secondOperandTypeSelectedList: copyOfsecondOperandTypeSelectedList
			}
		);
	}

	_handleLogicalOperationChange(event) {
		const {target} = event;

		const logicalOperatorSelected = target.innerHTML;

		let copyOfLogicalOperator = this.logicalOperator;

		if (logicalOperatorSelected != copyOfLogicalOperator) {
			copyOfLogicalOperator = logicalOperatorSelected.toLowerCase();

			this.setState(
				{
					logicalOperator: copyOfLogicalOperator
				}
			);
		}
	}

	_handleModalButtonClicked(event) {
		console.log(this.indexCondition);

		event.stopPropagation();

		if (!event.target.classList.contains('close-modal')) {
			const indexCondition = this.indexCondition;

			const copyOfConditions = this.conditions;

			copyOfConditions.splice(indexCondition, 1);

			const copyOfSecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

			copyOfSecondOperandTypeSelectedList.splice(indexCondition, 1);

			this.setState(
				{
					conditions: copyOfConditions,
					indexCondition: '',
					secondOperandTypeSelectedList: copyOfSecondOperandTypeSelectedList,
					visibleModal: false
				}
			);
		}
	}

	_handleOperatorSelection(event) {
		const {originalEvent, value} = event;
		const fieldName = originalEvent.target.getAttribute('data-option-value');
		const index = this._getConditionIndex(originalEvent, '.condition-operator');

		let copyOfConditions = this.conditions;

		const copyOfsecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

		if (!fieldName || !this._isBinary(fieldName)) {
			copyOfConditions = this._clearSecondOperandValue(copyOfConditions, index);

			if (!fieldName) {
				copyOfConditions[index].operator = '';
			}
			else {
				copyOfConditions[index].operator = value;
			}

			const configUnary = {name: 'none', value: 'none'};

			copyOfsecondOperandTypeSelectedList[index] = configUnary;
		}
		else {
			const previousOperator = copyOfConditions[index].operator;

			const type = this._setType(this.conditions[index].operands[0].type);

			const name = this._getMetaDataName(type, previousOperator);

			if (name == '' || !this._isBinary(name)) {
				copyOfsecondOperandTypeSelectedList[index] = {id: index, name: '', value: ''};
			}
			copyOfConditions[index].operator = value;
		}

		this.setState(
			{
				conditions: copyOfConditions,
				secondOperandTypeSelectedList: copyOfsecondOperandTypeSelectedList
			}
		);
	}

	_handleSecondOperandSelection(event) {
		const {originalEvent, value} = event;

		let index;

		if (originalEvent.delegateTarget.closest('.condition-type-value')) {
			index = this._getConditionIndex(originalEvent, '.condition-type-value');
		}
		else if (originalEvent.delegateTarget.closest('.condition-type-value-select')) {
			index = this._getConditionIndex(originalEvent, '.condition-type-value-select');
		}
		else if (originalEvent.delegateTarget.closest('.condition-user-role')) {
			index = this._getConditionIndex(originalEvent, '.condition-user-role');
		}
		else {
			index = this._getConditionIndex(originalEvent, '.condition-type-value-select-options');
		}

		const fieldName = originalEvent.target.getAttribute('data-option-value');

		let fieldType = '';

		if (fieldName) {
			fieldType = this._getFieldType(fieldName);

			if (fieldType === 'numeric') {
				fieldType = 'number';
			}
		}

		const copyOfConditions = this.conditions;

		const operandSelected = {fieldType, value};

		copyOfConditions[index].operands[1] = operandSelected;

		this.setState(
			{
				conditions: copyOfConditions
			}
		);
	}

	_handleTypeSelection(event) {
		const {originalEvent, value} = event;
		const fieldName = originalEvent.target.getAttribute('data-option-value');

		const index = this._getConditionIndex(originalEvent, '.condition-type');

		let previousTypeSelected = '';

		let copyOfConditions = this.conditions;

		let copyOfsecondOperandTypeSelectedList = [];

		if (this.secondOperandTypeSelectedList) {
			copyOfsecondOperandTypeSelectedList = this.secondOperandTypeSelectedList;

			previousTypeSelected = copyOfsecondOperandTypeSelectedList[index].name;
		}

		const reloadType = (fieldName == null || fieldName == 'field') && (previousTypeSelected !== fieldName);

		if (fieldName == '' || (reloadType && copyOfConditions[index].operands[0].value)) {
			const newOperandType = {name: fieldName, value};

			copyOfsecondOperandTypeSelectedList[index] = newOperandType;

			copyOfConditions = this._clearSecondOperandValue(copyOfConditions, index);

			this.setState(
				{
					conditions: copyOfConditions,
					secondOperandTypeSelectedList: copyOfsecondOperandTypeSelectedList
				}
			);
		}
	}

	_isBinary(value) {
		return value === 'equals-to' || value === 'not-equals-to' || value === 'contains' || value === 'not-contains' || value === 'belongs-to' || value === 'greater-than' || value === 'greater-than-equals' || value === 'less-than' || value === 'less-than-equals';
	}

	_setType(type) {
		if (type === 'numeric') {
			type = 'number';
		}
		else if (type === 'date') {
			type = 'text';
		}

		if (this._fieldHasOptions(type)) {
			type = 'text';
		}

		return type;
	}
}

Soy.register(RuleEditor, templates);

export default RuleEditor;