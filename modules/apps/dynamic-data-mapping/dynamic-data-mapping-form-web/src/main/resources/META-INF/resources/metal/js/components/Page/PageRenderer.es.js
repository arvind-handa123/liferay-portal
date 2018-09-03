import 'clay-button';
import {Config} from 'metal-state';
import {dom} from 'metal-dom';
import {pageStructure} from '../../util/config.es';
import {setLocalizedValue} from '../../util/i18n.es';
import {sub} from '../../util/strings.es';
import Component from 'metal-component';
import FormSupport from '../Form/FormSupport.es';
import Soy from 'metal-soy';
import templates from './PageRenderer.soy.js';

class PageRenderer extends Component {
	static STATE = {

		/**
		 * @instance
		 * @memberof FormPage
		 * @type {?number}
		 */

		activePage: Config.number().value(0),

		/**
		 * @instance
		 * @memberof FormPage
		 * @type {?string}
		 */

		descriptionPlaceholder: Config.string()
			.value(Liferay.Language.get('add-a-short-description-for-this-page')),

		/**
		 * @default 1
		 * @instance
		 * @memberof FormPage
		 * @type {?number}
		 */

		pageId: Config.number().value(0),

		/**
		 * @default []
		 * @instance
		 * @memberof FormRenderer
		 * @type {?array<object>}
		 */

		page: pageStructure,

		/**
		 * @default undefined
		 * @instance
		 * @memberof FormRenderer
		 * @type {!string}
		 */

		spritemap: Config.string().required(),

		/**
		 * @default 1
		 * @instance
		 * @memberof FormPage
		 * @type {?number}
		 */

		total: Config.number().value(1),

		/**
		 * @instance
		 * @memberof FormPage
		 * @type {?string}
		 */

		titlePlaceholder: Config.string()
	}

	prepareStateForRender(states) {
		return {
			...states,
			empty: this._isEmptyPage(states.page)
		};
	}

	willAttach() {
		this.titlePlaceholder = this._getTitlePlaceholder();
	}

	willReceiveState() {
		this.titlePlaceholder = this._getTitlePlaceholder();
	}

	/**
	 * @param {Object} event
	 * @param {String} pageProperty
	 * @private
	 */

	_changePageForm({delegateTarget}, pageProperty) {
		const {value} = delegateTarget;

		const languageId = Liferay.ThemeDisplay.getLanguageId();
		const page = {...this.page};

		setLocalizedValue(page, languageId, pageProperty, value);

		return page;
	}

	/**
	 * @param {!Event} event
	 * @param {!String} mode
	 * @private
	 */

	_emitFieldClicked(event, mode) {
		const index = FormSupport.getIndexes(event);

		this.emit(
			'fieldClicked',
			{
				...index,
				mode
			}
		);
	}

	/**
	 * @param {number} pageId
	 * @private
	 */

	_getTitlePlaceholder() {
		return sub(
			Liferay.Language.get('untitled-page-x-of-x'),
			[
				this.pageId + 1,
				this.total
			]
		);
	}

	/**
	 * @param {!Object} event
	 * @private
	 */

	_handlePageDescriptionChanged(event) {
		const page = this._changePageForm(event, 'description');
		const {delegateTarget: {dataset}} = event;
		let {pageId} = dataset;

		pageId = parseInt(pageId, 10);

		this.emit(
			'updatePage',
			{
				page,
				pageId
			}
		);
	}

	/**
	 * @param {!Object} event
	 * @private
	 */

	_handlePageTitleChanged(event) {
		const page = this._changePageForm(event, 'title');
		const {delegateTarget: {dataset}} = event;
		let {pageId} = dataset;

		pageId = parseInt(pageId, 10);

		this.emit(
			'updatePage',
			{
				page,
				pageId
			}
		);
	}

	/**
	 * @param {!Object} data
	 * @private
	 */

	_handleFieldChanged(data) {
		this.emit('fieldEdited', data);
	}

	/**
     * @param {!Event} event
     * @private
     */

	_handleDuplicateButtonClicked(event) {
		const index = FormSupport.getIndexes(
			dom.closest(event.target, '.col-ddm')
		);

		this.emit(
			'duplicateButtonClicked',
			{
				...index
			}
		);
	}

	/**
	 * @param {!Event} event
	 * @private
	 */

	_handleOnClickResize() {}

	/**
	 * @param {!Event} event
	 * @private
	 */

	_handleModal(event) {
		event.stopPropagation();

		const index = FormSupport.getIndexes(
			dom.closest(event.target, '.col-ddm')
		);

		this.emit('deleteFieldClicked', index);
	}

	/**
	 * @param {!Event} event
	 * @private
	 */

	_handleSelectFieldFocused(event) {
		this._emitFieldClicked(
			event.delegateTarget.parentElement.parentElement,
			'edit'
		);
	}

	_isEmptyPage({rows}) {
		let empty = false;
		if (!rows || !rows.length) {
			empty = true;
		}
		else {
			empty = !rows.some(
				({columns}) => {
					let hasFields = true;
					if (!columns) {
						hasFields = false;
					}
					else {
						hasFields = columns.some(column => column.fields.length);
					}
					return hasFields;
				}
			);
		}
		return empty;
	}
}

Soy.register(PageRenderer, templates);

export default PageRenderer;