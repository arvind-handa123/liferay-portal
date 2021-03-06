/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.asset.kernel.service;

import aQute.bnd.annotation.ProviderType;

import com.liferay.portal.kernel.bean.PortalBeanLocatorUtil;
import com.liferay.portal.kernel.util.ReferenceRegistry;

/**
 * Provides the remote service utility for AssetEntry. This utility wraps
 * {@link com.liferay.portlet.asset.service.impl.AssetEntryServiceImpl} and is the
 * primary access point for service operations in application layer code running
 * on a remote server. Methods of this service are expected to have security
 * checks based on the propagated JAAS credentials because this service can be
 * accessed remotely.
 *
 * @author Brian Wing Shun Chan
 * @see AssetEntryService
 * @see com.liferay.portlet.asset.service.base.AssetEntryServiceBaseImpl
 * @see com.liferay.portlet.asset.service.impl.AssetEntryServiceImpl
 * @generated
 */
@ProviderType
public class AssetEntryServiceUtil {
	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to {@link com.liferay.portlet.asset.service.impl.AssetEntryServiceImpl} and rerun ServiceBuilder to regenerate this class.
	 */
	public static com.liferay.asset.kernel.model.AssetEntry fetchEntry(
		long entryId)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService().fetchEntry(entryId);
	}

	public static java.util.List<com.liferay.asset.kernel.model.AssetEntry> getCompanyEntries(
		long companyId, int start, int end) {
		return getService().getCompanyEntries(companyId, start, end);
	}

	public static int getCompanyEntriesCount(long companyId) {
		return getService().getCompanyEntriesCount(companyId);
	}

	public static java.util.List<com.liferay.asset.kernel.model.AssetEntry> getEntries(
		com.liferay.asset.kernel.service.persistence.AssetEntryQuery entryQuery)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService().getEntries(entryQuery);
	}

	public static int getEntriesCount(
		com.liferay.asset.kernel.service.persistence.AssetEntryQuery entryQuery)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService().getEntriesCount(entryQuery);
	}

	public static com.liferay.asset.kernel.model.AssetEntry getEntry(
		long entryId)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService().getEntry(entryId);
	}

	/**
	* Returns the OSGi service identifier.
	*
	* @return the OSGi service identifier
	*/
	public static String getOSGiServiceIdentifier() {
		return getService().getOSGiServiceIdentifier();
	}

	public static void incrementViewCounter(
		com.liferay.asset.kernel.model.AssetEntry assetEntry)
		throws com.liferay.portal.kernel.exception.PortalException {
		getService().incrementViewCounter(assetEntry);
	}

	public static com.liferay.asset.kernel.model.AssetEntry incrementViewCounter(
		String className, long classPK)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService().incrementViewCounter(className, classPK);
	}

	public static com.liferay.asset.kernel.model.AssetEntry updateEntry(
		long groupId, java.util.Date createDate, java.util.Date modifiedDate,
		String className, long classPK, String classUuid, long classTypeId,
		long[] categoryIds, String[] tagNames, boolean listable,
		boolean visible, java.util.Date startDate, java.util.Date endDate,
		java.util.Date publishDate, java.util.Date expirationDate,
		String mimeType, String title, String description, String summary,
		String url, String layoutUuid, int height, int width, Double priority)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService()
				   .updateEntry(groupId, createDate, modifiedDate, className,
			classPK, classUuid, classTypeId, categoryIds, tagNames, listable,
			visible, startDate, endDate, publishDate, expirationDate, mimeType,
			title, description, summary, url, layoutUuid, height, width,
			priority);
	}

	/**
	* @deprecated As of Judson (7.1.x), replaced by {@link #updateEntry(long,
	Date, Date, String, long, String, long, long[], String[],
	boolean, boolean, Date, Date, Date, Date, String, String,
	String, String, String, String, int, int, Double)}
	*/
	@Deprecated
	public static com.liferay.asset.kernel.model.AssetEntry updateEntry(
		long groupId, java.util.Date createDate, java.util.Date modifiedDate,
		String className, long classPK, String classUuid, long classTypeId,
		long[] categoryIds, String[] tagNames, boolean listable,
		boolean visible, java.util.Date startDate, java.util.Date endDate,
		java.util.Date expirationDate, String mimeType, String title,
		String description, String summary, String url, String layoutUuid,
		int height, int width, Double priority)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService()
				   .updateEntry(groupId, createDate, modifiedDate, className,
			classPK, classUuid, classTypeId, categoryIds, tagNames, listable,
			visible, startDate, endDate, expirationDate, mimeType, title,
			description, summary, url, layoutUuid, height, width, priority);
	}

	/**
	* @deprecated As of Wilberforce (7.0.x), replaced by {@link
	#updateEntry(long, Date, Date, String, long, String, long,
	long[], String[], boolean, boolean, Date, Date, Date, Date,
	String, String, String, String, String, String, int, int,
	Double)}
	*/
	@Deprecated
	public static com.liferay.asset.kernel.model.AssetEntry updateEntry(
		long groupId, java.util.Date createDate, java.util.Date modifiedDate,
		String className, long classPK, String classUuid, long classTypeId,
		long[] categoryIds, String[] tagNames, boolean visible,
		java.util.Date startDate, java.util.Date endDate,
		java.util.Date expirationDate, String mimeType, String title,
		String description, String summary, String url, String layoutUuid,
		int height, int width, Integer priority, boolean sync)
		throws com.liferay.portal.kernel.exception.PortalException {
		return getService()
				   .updateEntry(groupId, createDate, modifiedDate, className,
			classPK, classUuid, classTypeId, categoryIds, tagNames, visible,
			startDate, endDate, expirationDate, mimeType, title, description,
			summary, url, layoutUuid, height, width, priority, sync);
	}

	public static AssetEntryService getService() {
		if (_service == null) {
			_service = (AssetEntryService)PortalBeanLocatorUtil.locate(AssetEntryService.class.getName());

			ReferenceRegistry.registerReference(AssetEntryServiceUtil.class,
				"_service");
		}

		return _service;
	}

	private static AssetEntryService _service;
}