import {Config} from 'metal-state';
import {dom} from 'metal-dom';
import Builder from './pages/builder/index.es';
import RuleBuilder from './pages/RuleBuilder/index.es';
import Component from 'metal-jsx';
import LayoutProvider from './components/LayoutProvider/index.es';
import loader from './components/FieldsLoader/index.es';
import withAppComposer from './hocs/withAppComposer/index.es';

const LayoutProviderWithAppComposer = withAppComposer(LayoutProvider);

/**
 * Form.
 * @extends Component
 */

class Form extends Component {
	static PROPS = {

		/**
		 * The context for rendering a layout that represents a form.
		 * @default undefined
		 * @instance
		 * @memberof Form
		 * @type {!array}
		 */

		context: Config.array().required(),

		/**
		 * The rules of a form.
		 * @default undefined
		 * @instance
		 * @memberof Form
		 * @type {!array}
		 */

		rules: Config.array(),

		/**
		 * The path to the SVG spritemap file containing the icons.
		 * @default undefined
		 * @instance
		 * @memberof Form
		 * @type {!string}
		 */

		spritemap: Config.string().required()
	};

	static STATE = {

		/**
		 * The represent the current active screen mode where 0 => FormBuilder and 1 => RuleBuilder
		 * @default undefined
		 * @instance
		 * @memberof Form
		 * @type {!array}
		 */

		activeFormMode: Config.number().value(0)
	}

	attached() {
		dom.on('.forms-management-bar li', 'click', this._handleFormNavClicked.bind(this));
	}

	_handleFormNavClicked(event) {
		const {delegateTarget, target} = event;
		const {navItemIndex} = delegateTarget.dataset;
		const addButton = document.querySelector('#addFieldButton');
		const formBuilderButtons = document.querySelector('.ddm-form-builder-buttons');
		const publishIcon = document.querySelector('.publish-icon');

		if (navItemIndex !== this.state.activeFormMode) {
			this.setState(
				{
					activeFormMode: parseInt(navItemIndex, 10)
				}
			);

			document.querySelector('.forms-management-bar li>a.active').classList.remove('active');

			if (parseInt(this.state.activeFormMode, 10)) {
				formBuilderButtons.classList.add('hide');
				publishIcon.classList.add('hide');
			}
			else {
				formBuilderButtons.classList.remove('hide');
				addButton.classList.remove('hide');
				publishIcon.classList.remove('hide');
			}

			target.classList.add('active');
		}
	}

	/**
	 * @inheritDoc
	 */

	render() {
		let mode = <Builder />;

		if (parseInt(this.state.activeFormMode, 10)) {
			mode = <RuleBuilder context={this.props.context} rules={this.props.rules} />;
		}
		return (
			<div>
				<LayoutProviderWithAppComposer {...this.props}>
					{mode}
				</LayoutProviderWithAppComposer>
			</div>
		);
	}
}

const DDMForm = (props, container, callback) => {
	loader(
		(...args) => {
			callback(
				new Form(
					{
						...props,
						translationManager: args[args.length - 1].default
					},
					container
				)
			);
		},
		props.modules,
		[...props.dependencies]
	);
};

export default DDMForm;
export {DDMForm};