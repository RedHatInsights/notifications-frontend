/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import * as z from 'zod';
import { ValidatedResponse } from 'openapi2typescript';
import { Action } from 'react-fetching-library';
import { ValidateRule } from 'openapi2typescript';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript/react-fetching-library';

export namespace Schemas {
    export const Access = zodSchemaAccess();
    export type Access = z.infer<typeof Access>;

    export const AccessPagination = zodSchemaAccessPagination();
    export type AccessPagination = z.infer<typeof AccessPagination>;

    export const AdditionalGroup = zodSchemaAdditionalGroup();
    export type AdditionalGroup = z.infer<typeof AdditionalGroup>;

    export const CrossAccountRequest = zodSchemaCrossAccountRequest();
    export type CrossAccountRequest = z.infer<typeof CrossAccountRequest>;

    export const CrossAccountRequestByAccount =
        zodSchemaCrossAccountRequestByAccount();
    export type CrossAccountRequestByAccount = z.infer<
        typeof CrossAccountRequestByAccount
        >;

    export const CrossAccountRequestByUserId =
        zodSchemaCrossAccountRequestByUserId();
    export type CrossAccountRequestByUserId = z.infer<
        typeof CrossAccountRequestByUserId
        >;

    export const CrossAccountRequestDetail = zodSchemaCrossAccountRequestDetail();
    export type CrossAccountRequestDetail = z.infer<
        typeof CrossAccountRequestDetail
        >;

    export const CrossAccountRequestDetailByAccount =
        zodSchemaCrossAccountRequestDetailByAccount();
    export type CrossAccountRequestDetailByAccount = z.infer<
        typeof CrossAccountRequestDetailByAccount
        >;

    export const CrossAccountRequestDetailByUseId =
        zodSchemaCrossAccountRequestDetailByUseId();
    export type CrossAccountRequestDetailByUseId = z.infer<
        typeof CrossAccountRequestDetailByUseId
        >;

    export const CrossAccountRequestIn = zodSchemaCrossAccountRequestIn();
    export type CrossAccountRequestIn = z.infer<typeof CrossAccountRequestIn>;

    export const CrossAccountRequestOut = zodSchemaCrossAccountRequestOut();
    export type CrossAccountRequestOut = z.infer<typeof CrossAccountRequestOut>;

    export const CrossAccountRequestPagination =
        zodSchemaCrossAccountRequestPagination();
    export type CrossAccountRequestPagination = z.infer<
        typeof CrossAccountRequestPagination
        >;

    export const CrossAccountRequestPatch = zodSchemaCrossAccountRequestPatch();
    export type CrossAccountRequestPatch = z.infer<
        typeof CrossAccountRequestPatch
        >;

    export const CrossAccountRequestUpdateIn =
        zodSchemaCrossAccountRequestUpdateIn();
    export type CrossAccountRequestUpdateIn = z.infer<
        typeof CrossAccountRequestUpdateIn
        >;

    export const CrossAccountRequestWithRoles =
        zodSchemaCrossAccountRequestWithRoles();
    export type CrossAccountRequestWithRoles = z.infer<
        typeof CrossAccountRequestWithRoles
        >;

    export const Error = zodSchemaError();
    export type Error = z.infer<typeof Error>;

    export const Error403 = zodSchemaError403();
    export type Error403 = z.infer<typeof Error403>;

    export const Group = zodSchemaGroup();
    export type Group = z.infer<typeof Group>;

    export const GroupOut = zodSchemaGroupOut();
    export type GroupOut = z.infer<typeof GroupOut>;

    export const GroupPagination = zodSchemaGroupPagination();
    export type GroupPagination = z.infer<typeof GroupPagination>;

    export const GroupPrincipalIn = zodSchemaGroupPrincipalIn();
    export type GroupPrincipalIn = z.infer<typeof GroupPrincipalIn>;

    export const GroupRoleIn = zodSchemaGroupRoleIn();
    export type GroupRoleIn = z.infer<typeof GroupRoleIn>;

    export const GroupRolesPagination = zodSchemaGroupRolesPagination();
    export type GroupRolesPagination = z.infer<typeof GroupRolesPagination>;

    export const GroupWithPrincipals = zodSchemaGroupWithPrincipals();
    export type GroupWithPrincipals = z.infer<typeof GroupWithPrincipals>;

    export const GroupWithPrincipalsAndRoles =
        zodSchemaGroupWithPrincipalsAndRoles();
    export type GroupWithPrincipalsAndRoles = z.infer<
        typeof GroupWithPrincipalsAndRoles
        >;

    export const ListPagination = zodSchemaListPagination();
    export type ListPagination = z.infer<typeof ListPagination>;

    export const PaginationLinks = zodSchemaPaginationLinks();
    export type PaginationLinks = z.infer<typeof PaginationLinks>;

    export const PaginationMeta = zodSchemaPaginationMeta();
    export type PaginationMeta = z.infer<typeof PaginationMeta>;

    export const Permission = zodSchemaPermission();
    export type Permission = z.infer<typeof Permission>;

    export const PermissionOptionsPagination =
        zodSchemaPermissionOptionsPagination();
    export type PermissionOptionsPagination = z.infer<
        typeof PermissionOptionsPagination
        >;

    export const PermissionPagination = zodSchemaPermissionPagination();
    export type PermissionPagination = z.infer<typeof PermissionPagination>;

    export const Policy = zodSchemaPolicy();
    export type Policy = z.infer<typeof Policy>;

    export const PolicyExtended = zodSchemaPolicyExtended();
    export type PolicyExtended = z.infer<typeof PolicyExtended>;

    export const PolicyIn = zodSchemaPolicyIn();
    export type PolicyIn = z.infer<typeof PolicyIn>;

    export const PolicyPagination = zodSchemaPolicyPagination();
    export type PolicyPagination = z.infer<typeof PolicyPagination>;

    export const Principal = zodSchemaPrincipal();
    export type Principal = z.infer<typeof Principal>;

    export const PrincipalIn = zodSchemaPrincipalIn();
    export type PrincipalIn = z.infer<typeof PrincipalIn>;

    export const PrincipalOut = zodSchemaPrincipalOut();
    export type PrincipalOut = z.infer<typeof PrincipalOut>;

    export const PrincipalPagination = zodSchemaPrincipalPagination();
    export type PrincipalPagination = z.infer<typeof PrincipalPagination>;

    export const ResourceDefinition = zodSchemaResourceDefinition();
    export type ResourceDefinition = z.infer<typeof ResourceDefinition>;

    export const ResourceDefinitionFilter = zodSchemaResourceDefinitionFilter();
    export type ResourceDefinitionFilter = z.infer<
        typeof ResourceDefinitionFilter
        >;

    export const Role = zodSchemaRole();
    export type Role = z.infer<typeof Role>;

    export const RoleIn = zodSchemaRoleIn();
    export type RoleIn = z.infer<typeof RoleIn>;

    export const RoleOut = zodSchemaRoleOut();
    export type RoleOut = z.infer<typeof RoleOut>;

    export const RoleOutDynamic = zodSchemaRoleOutDynamic();
    export type RoleOutDynamic = z.infer<typeof RoleOutDynamic>;

    export const RolePagination = zodSchemaRolePagination();
    export type RolePagination = z.infer<typeof RolePagination>;

    export const RolePaginationDynamic = zodSchemaRolePaginationDynamic();
    export type RolePaginationDynamic = z.infer<typeof RolePaginationDynamic>;

    export const RolePatch = zodSchemaRolePatch();
    export type RolePatch = z.infer<typeof RolePatch>;

    export const RoleWithAccess = zodSchemaRoleWithAccess();
    export type RoleWithAccess = z.infer<typeof RoleWithAccess>;

    export const Status = zodSchemaStatus();
    export type Status = z.infer<typeof Status>;

    export const Timestamped = zodSchemaTimestamped();
    export type Timestamped = z.infer<typeof Timestamped>;

    export const UUID = zodSchemaUUID();
    export type UUID = z.infer<typeof UUID>;

    export const __Empty = zodSchema__Empty();
    export type __Empty = z.infer<typeof __Empty>;

    function zodSchemaAccess() {
        return z.object({
            permission: z.string(),
            resourceDefinitions: z.array(zodSchemaResourceDefinition())
        });
    }

    function zodSchemaAccessPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaAccess())
            })
        );
    }

    function zodSchemaAdditionalGroup() {
        return z.object({
            description: z.string().optional().nullable(),
            name: z.string().optional().nullable(),
            uuid: z.string().optional().nullable()
        });
    }

    function zodSchemaCrossAccountRequest() {
        return z.object({
            created: z.string().optional().nullable(),
            end_date: z.unknown().optional().nullable(),
            request_id: z.string().optional().nullable(),
            start_date: z.unknown().optional().nullable(),
            status: z.string().optional().nullable(),
            target_account: z.string().optional().nullable()
        });
    }

    function zodSchemaCrossAccountRequestByAccount() {
        return z.intersection(
            zodSchemaCrossAccountRequest(),
            z.object({
                email: z.string().optional().nullable(),
                first_name: z.string().optional().nullable(),
                last_name: z.string().optional().nullable()
            })
        );
    }

    function zodSchemaCrossAccountRequestByUserId() {
        return z.intersection(
            zodSchemaCrossAccountRequest(),
            z.object({
                user_id: z.string().optional().nullable()
            })
        );
    }

    function zodSchemaCrossAccountRequestDetail() {
        return z.union([
            zodSchemaCrossAccountRequestDetailByAccount(),
            zodSchemaCrossAccountRequestDetailByUseId()
        ]);
    }

    function zodSchemaCrossAccountRequestDetailByAccount() {
        return z.intersection(
            zodSchemaCrossAccountRequestWithRoles(),
            z.object({
                email: z.unknown().optional().nullable(),
                first_name: z.unknown().optional().nullable(),
                last_name: z.unknown().optional().nullable()
            })
        );
    }

    function zodSchemaCrossAccountRequestDetailByUseId() {
        return z.intersection(
            zodSchemaCrossAccountRequestWithRoles(),
            z.object({
                user_id: z.unknown().optional().nullable()
            })
        );
    }

    function zodSchemaCrossAccountRequestIn() {
        return z.object({
            end_date: z.string(),
            roles: z.array(z.string()),
            start_date: z.string(),
            target_account: z.string()
        });
    }

    function zodSchemaCrossAccountRequestOut() {
        return z.intersection(
            zodSchemaCrossAccountRequestWithRoles(),
            z.object({
                user_id: z.string().optional().nullable()
            })
        );
    }

    function zodSchemaCrossAccountRequestPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(
                    z.union([
                        zodSchemaCrossAccountRequestByAccount(),
                        zodSchemaCrossAccountRequestByUserId()
                    ])
                )
            })
        );
    }

    function zodSchemaCrossAccountRequestPatch() {
        return z.object({
            end_date: z.string().optional().nullable(),
            roles: z.array(z.string()).optional().nullable(),
            start_date: z.string().optional().nullable(),
            status: z
                .enum([ 'pending', 'approved', 'expired', 'cancelled', 'denied' ])
                .optional()
                .nullable()
        });
    }

    function zodSchemaCrossAccountRequestUpdateIn() {
        return z.object({
            end_date: z.string(),
            roles: z.array(z.string()),
            start_date: z.string(),
            status: z
                .enum([ 'pending', 'approved', 'expired', 'cancelled', 'denied' ])
                .optional()
                .nullable()
        });
    }

    function zodSchemaCrossAccountRequestWithRoles() {
        return z.object({
            created: z.string().optional().nullable(),
            end_date: z.string().optional().nullable(),
            request_id: z.string().optional().nullable(),
            roles: z
                .array(
                    z.object({
                        description: z.string().optional().nullable(),
                        display_name: z.string().optional().nullable(),
                        permissions: z.array(zodSchemaPermission()).optional().nullable()
                    })
                )
                .optional()
                .nullable(),
            start_date: z.string().optional().nullable(),
            status: z.string().optional().nullable(),
            target_account: z.string().optional().nullable()
        });
    }

    function zodSchemaError() {
        return z.object({
            errors: z.array(
                z.object({
                    detail: z.string().optional().nullable(),
                    status: z.string().optional().nullable()
                })
            )
        });
    }

    function zodSchemaError403() {
        return z.object({
            errors: z.array(
                z.object({
                    detail: z.string().optional().nullable(),
                    source: z.string().optional().nullable(),
                    status: z.string().optional().nullable()
                })
            )
        });
    }

    function zodSchemaGroup() {
        return z.object({
            description: z.string().optional().nullable(),
            name: z.string()
        });
    }

    function zodSchemaGroupOut() {
        return z.intersection(
            zodSchemaGroup(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        platform_default: z.boolean().optional().nullable(),
                        principalCount: z.number().int().optional().nullable(),
                        roleCount: z.number().int().optional().nullable(),
                        system: z.boolean().optional().nullable()
                    })
                )
            )
        );
    }

    function zodSchemaGroupPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaGroupOut())
            })
        );
    }

    function zodSchemaGroupPrincipalIn() {
        return z.object({
            principals: z.array(zodSchemaPrincipalIn())
        });
    }

    function zodSchemaGroupRoleIn() {
        return z.object({
            roles: z.array(z.string())
        });
    }

    function zodSchemaGroupRolesPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaRoleOut())
            })
        );
    }

    function zodSchemaGroupWithPrincipals() {
        return z.intersection(
            zodSchemaGroup(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        principals: z.array(zodSchemaPrincipal())
                    })
                )
            )
        );
    }

    function zodSchemaGroupWithPrincipalsAndRoles() {
        return z.intersection(
            zodSchemaGroup(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        principals: z.array(zodSchemaPrincipal()),
                        roles: z.array(zodSchemaRoleOut())
                    })
                )
            )
        );
    }

    function zodSchemaListPagination() {
        return z.object({
            links: zodSchemaPaginationLinks().optional().nullable(),
            meta: zodSchemaPaginationMeta().optional().nullable()
        });
    }

    function zodSchemaPaginationLinks() {
        return z.object({
            first: z.string().optional().nullable(),
            last: z.string().optional().nullable(),
            next: z.string().optional().nullable(),
            previous: z.string().optional().nullable()
        });
    }

    function zodSchemaPaginationMeta() {
        return z.object({
            count: z.number().int().optional().nullable()
        });
    }

    function zodSchemaPermission() {
        return z.object({
            application: z.string().optional().nullable(),
            description: z.string().optional().nullable(),
            permission: z.string().optional().nullable(),
            resource_type: z.string().optional().nullable(),
            verb: z.string().optional().nullable()
        });
    }

    function zodSchemaPermissionOptionsPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(z.string())
            })
        );
    }

    function zodSchemaPermissionPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaPermission())
            })
        );
    }

    function zodSchemaPolicy() {
        return z.object({
            description: z.string().optional().nullable(),
            name: z.string()
        });
    }

    function zodSchemaPolicyExtended() {
        return z.intersection(
            zodSchemaPolicy(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        group: zodSchemaGroupOut(),
                        roles: z.array(zodSchemaRoleOut())
                    })
                )
            )
        );
    }

    function zodSchemaPolicyIn() {
        return z.intersection(
            zodSchemaPolicy(),
            z.object({
                group: z.string(),
                roles: z.array(z.string())
            })
        );
    }

    function zodSchemaPolicyPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaPolicyExtended())
            })
        );
    }

    function zodSchemaPrincipal() {
        return z.object({
            email: z.string(),
            first_name: z.string().optional().nullable(),
            is_active: z.boolean().optional().nullable(),
            is_org_admin: z.boolean().optional().nullable(),
            last_name: z.string().optional().nullable(),
            username: z.string()
        });
    }

    function zodSchemaPrincipalIn() {
        return z.object({
            username: z.string()
        });
    }

    function zodSchemaPrincipalOut() {
        return z.intersection(zodSchemaPrincipal(), zodSchemaUUID());
    }

    function zodSchemaPrincipalPagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaPrincipal())
            })
        );
    }

    function zodSchemaResourceDefinition() {
        return z.object({
            attributeFilter: zodSchemaResourceDefinitionFilter()
        });
    }

    function zodSchemaResourceDefinitionFilter() {
        return z.object({
            key: z.string(),
            operation: z.enum([ 'equal', 'in' ]),
            value: z.string()
        });
    }

    function zodSchemaRole() {
        return z.object({
            description: z.string().optional().nullable(),
            display_name: z.string().optional().nullable(),
            name: z.string()
        });
    }

    function zodSchemaRoleIn() {
        return z.intersection(
            zodSchemaRole(),
            z.object({
                access: z.array(zodSchemaAccess())
            })
        );
    }

    function zodSchemaRoleOut() {
        return z.intersection(
            zodSchemaRole(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        accessCount: z.number().int().optional().nullable(),
                        applications: z.array(z.string()).optional().nullable(),
                        platform_default: z.boolean().optional().nullable(),
                        policyCount: z.number().int().optional().nullable(),
                        system: z.boolean().optional().nullable()
                    })
                )
            )
        );
    }

    function zodSchemaRoleOutDynamic() {
        return z.intersection(
            zodSchemaRole(),
            z.intersection(
                zodSchemaUUID(),
                z.intersection(
                    zodSchemaTimestamped(),
                    z.object({
                        accessCount: z.number().int(),
                        applications: z.array(z.string()),
                        groups_in: z
                            .array(zodSchemaAdditionalGroup())
                            .optional()
                            .nullable(),
                        groups_in_count: z.number().int().optional().nullable(),
                        platform_default: z.boolean(),
                        policyCount: z.number().int(),
                        system: z.boolean()
                    })
                )
            )
        );
    }

    function zodSchemaRolePagination() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaRoleOut())
            })
        );
    }

    function zodSchemaRolePaginationDynamic() {
        return z.intersection(
            zodSchemaListPagination(),
            z.object({
                data: z.array(zodSchemaRoleOutDynamic())
            })
        );
    }

    function zodSchemaRolePatch() {
        return z.object({
            description: z.string().optional().nullable(),
            display_name: z.string().optional().nullable(),
            name: z.string().optional().nullable()
        });
    }

    function zodSchemaRoleWithAccess() {
        return z.intersection(
            zodSchemaRoleOut(),
            z.object({
                access: z.array(zodSchemaAccess())
            })
        );
    }

    function zodSchemaStatus() {
        return z.object({
            api_version: z.number().int(),
            commit: z.string().optional().nullable()
        });
    }

    function zodSchemaTimestamped() {
        return z.object({
            created: z.string(),
            modified: z.string()
        });
    }

    function zodSchemaUUID() {
        return z.object({
            uuid: z.string()
        });
    }

    function zodSchema__Empty() {
        return z.string().max(0).optional();
    }
}

export namespace Operations {
    // GET /access/
    // Get the permitted access for a principal in the tenant (defaults to principal from the identity header)
    export namespace GetPrincipalAccess {
        const Application = z.string();
        type Application = z.infer<typeof Application>;
        const Username = z.string();
        type Username = z.infer<typeof Username>;
        const OrderBy = z.enum([ 'application', 'resource_type', 'verb' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        export interface Params {
            application: Application;
            username?: Username;
            orderBy?: OrderBy;
            limit?: Limit;
            offset?: Offset;
        }

        export type Payload =
            | ValidatedResponse<'AccessPagination', 200, Schemas.AccessPagination>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/access/';
            const query = {} as Record<string, any>;
            if (params.application !== undefined) {
                query.application = params.application;
            }

            if (params.username !== undefined) {
                query.username = params.username;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.AccessPagination, 'AccessPagination', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /cross-account-requests/
    // List the cross account requests for a user or account
    export namespace ListCrossAccountRequests {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const QueryBy = z.enum([ 'user_id', 'target_account' ]);
        type QueryBy = z.infer<typeof QueryBy>;
        const Account = z.string();
        type Account = z.infer<typeof Account>;
        const ApprovedOnly = z.enum([ 'true' ]);
        type ApprovedOnly = z.infer<typeof ApprovedOnly>;
        const Status = z.enum([
            'pending',
            'approved',
            'denied',
            'cancelled',
            'expired'
        ]);
        type Status = z.infer<typeof Status>;
        const OrderBy = z.enum([
            'request_id',
            'start_date',
            'end_date',
            'created',
            'modified',
            'status'
        ]);
        type OrderBy = z.infer<typeof OrderBy>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            queryBy?: QueryBy;
            account?: Account;
            approvedOnly?: ApprovedOnly;
            status?: Status;
            orderBy?: OrderBy;
        }

        export type Payload =
            | ValidatedResponse<
            'CrossAccountRequestPagination',
            200,
            Schemas.CrossAccountRequestPagination
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/cross-account-requests/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.queryBy !== undefined) {
                query.query_by = params.queryBy;
            }

            if (params.account !== undefined) {
                query.account = params.account;
            }

            if (params.approvedOnly !== undefined) {
                query.approved_only = params.approvedOnly;
            }

            if (params.status !== undefined) {
                query.status = params.status;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.CrossAccountRequestPagination,
                            'CrossAccountRequestPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /cross-account-requests/
    // Create a cross account request
    export namespace CreateCrossAccountRequests {
        export interface Params {
            body: Schemas.CrossAccountRequestIn;
        }

        export type Payload =
            | ValidatedResponse<
            'CrossAccountRequestOut',
            201,
            Schemas.CrossAccountRequestOut
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/cross-account-requests/';
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.CrossAccountRequestOut,
                            'CrossAccountRequestOut',
                            201
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /cross-account-requests/{uuid}/
    // Get a cross account request
    export namespace GetCrossAccountRequest {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const QueryBy = z.enum([ 'user_id', 'target_account' ]);
        type QueryBy = z.infer<typeof QueryBy>;
        const Account = z.string();
        type Account = z.infer<typeof Account>;
        const ApprovedOnly = z.enum([ 'true' ]);
        type ApprovedOnly = z.infer<typeof ApprovedOnly>;
        export interface Params {
            uuid: Uuid;
            queryBy?: QueryBy;
            account?: Account;
            approvedOnly?: ApprovedOnly;
        }

        export type Payload =
            | ValidatedResponse<
            'CrossAccountRequestDetail',
            200,
            Schemas.CrossAccountRequestDetail
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/cross-account-requests/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.queryBy !== undefined) {
                query.query_by = params.queryBy;
            }

            if (params.account !== undefined) {
                query.account = params.account;
            }

            if (params.approvedOnly !== undefined) {
                query.approved_only = params.approvedOnly;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.CrossAccountRequestDetail,
                            'CrossAccountRequestDetail',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // PUT /cross-account-requests/{uuid}/
    // Update a cross account request
    export namespace PutCrossAccountRequest {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.CrossAccountRequestUpdateIn;
        }

        export type Payload =
            | ValidatedResponse<
            'CrossAccountRequestDetail',
            200,
            Schemas.CrossAccountRequestDetail
            >
            | ValidatedResponse<
            'CrossAccountRequestOut',
            201,
            Schemas.CrossAccountRequestOut
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/cross-account-requests/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('PUT', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.CrossAccountRequestDetail,
                            'CrossAccountRequestDetail',
                            200
                        ),
                        new ValidateRule(
                            Schemas.CrossAccountRequestOut,
                            'CrossAccountRequestOut',
                            201
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /groups/
    // List the groups for a tenant
    export namespace ListGroups {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const Name = z.string();
        type Name = z.infer<typeof Name>;
        const NameMatch = z.enum([ 'partial', 'exact' ]);
        type NameMatch = z.infer<typeof NameMatch>;
        const Scope = z.enum([ 'account', 'principal' ]);
        type Scope = z.infer<typeof Scope>;
        const Username = z.string();
        type Username = z.infer<typeof Username>;
        const Uuid = z.array(z.string());
        type Uuid = z.infer<typeof Uuid>;
        const RoleNames = z.array(z.string());
        type RoleNames = z.infer<typeof RoleNames>;
        const RoleDiscriminator = z.enum([ 'all', 'any' ]);
        type RoleDiscriminator = z.infer<typeof RoleDiscriminator>;
        const OrderBy = z.enum([
            'name',
            'modified',
            'principalCount',
            'policyCount'
        ]);
        type OrderBy = z.infer<typeof OrderBy>;
        const PlatformDefault = z.boolean();
        type PlatformDefault = z.infer<typeof PlatformDefault>;
        const System = z.boolean();
        type System = z.infer<typeof System>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            name?: Name;
            nameMatch?: NameMatch;
            scope?: Scope;
            username?: Username;
            uuid?: Uuid;
            roleNames?: RoleNames;
            roleDiscriminator?: RoleDiscriminator;
            orderBy?: OrderBy;
            platformDefault?: PlatformDefault;
            system?: System;
        }

        export type Payload =
            | ValidatedResponse<'GroupPagination', 200, Schemas.GroupPagination>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.name !== undefined) {
                query.name = params.name;
            }

            if (params.nameMatch !== undefined) {
                query.name_match = params.nameMatch;
            }

            if (params.scope !== undefined) {
                query.scope = params.scope;
            }

            if (params.username !== undefined) {
                query.username = params.username;
            }

            if (params.uuid !== undefined) {
                query.uuid = params.uuid;
            }

            if (params.roleNames !== undefined) {
                query.role_names = params.roleNames;
            }

            if (params.roleDiscriminator !== undefined) {
                query.role_discriminator = params.roleDiscriminator;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            if (params.platformDefault !== undefined) {
                query.platform_default = params.platformDefault;
            }

            if (params.system !== undefined) {
                query.system = params.system;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.GroupPagination, 'GroupPagination', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /groups/
    // Create a group in a tenant
    export namespace CreateGroup {
        export interface Params {
            body: Schemas.Group;
        }

        export type Payload =
            | ValidatedResponse<'GroupOut', 201, Schemas.GroupOut>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/';
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.GroupOut, 'GroupOut', 201),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /groups/{uuid}/
    // Get a group in the tenant
    export namespace GetGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
        }

        export type Payload =
            | ValidatedResponse<
            'GroupWithPrincipalsAndRoles',
            200,
            Schemas.GroupWithPrincipalsAndRoles
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.GroupWithPrincipalsAndRoles,
                            'GroupWithPrincipalsAndRoles',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // PUT /groups/{uuid}/
    // Update a group in the tenant
    export namespace UpdateGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.Group;
        }

        export type Payload =
            | ValidatedResponse<'GroupOut', 200, Schemas.GroupOut>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('PUT', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.GroupOut, 'GroupOut', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // DELETE /groups/{uuid}/
    // Delete a group in the tenant
    export namespace DeleteGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('DELETE', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 204),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /groups/{uuid}/principals/
    // Get a list of principals from a group in the tenant
    export namespace GetPrincipalsFromGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const PrincipalUsername = z.string();
        type PrincipalUsername = z.infer<typeof PrincipalUsername>;
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const OrderBy = z.enum([ 'username' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        export interface Params {
            uuid: Uuid;
            principalUsername?: PrincipalUsername;
            limit?: Limit;
            offset?: Offset;
            orderBy?: OrderBy;
        }

        export type Payload =
            | ValidatedResponse<
            'PrincipalPagination',
            200,
            Schemas.PrincipalPagination
            >
            | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/principals/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.principalUsername !== undefined) {
                query.principal_username = params.principalUsername;
            }

            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.PrincipalPagination,
                            'PrincipalPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 400),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /groups/{uuid}/principals/
    // Add a principal to a group in the tenant
    export namespace AddPrincipalToGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.GroupPrincipalIn;
        }

        export type Payload =
            | ValidatedResponse<
            'GroupWithPrincipalsAndRoles',
            200,
            Schemas.GroupWithPrincipalsAndRoles
            >
            | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/principals/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.GroupWithPrincipalsAndRoles,
                            'GroupWithPrincipalsAndRoles',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 400),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // DELETE /groups/{uuid}/principals/
    // Remove a principal from a group in the tenant
    export namespace DeletePrincipalFromGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Usernames = z.string();
        type Usernames = z.infer<typeof Usernames>;
        export interface Params {
            uuid: Uuid;
            usernames: Usernames;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/principals/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.usernames !== undefined) {
                query.usernames = params.usernames;
            }

            return actionBuilder('DELETE', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 204),
                        new ValidateRule(Schemas.__Empty, '__Empty', 400),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /groups/{uuid}/roles/
    // List the roles for a group in the tenant
    export namespace ListRolesForGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Exclude = z.boolean();
        type Exclude = z.infer<typeof Exclude>;
        const RoleName = z.string();
        type RoleName = z.infer<typeof RoleName>;
        const RoleDisplayName = z.string();
        type RoleDisplayName = z.infer<typeof RoleDisplayName>;
        const RoleDescription = z.string();
        type RoleDescription = z.infer<typeof RoleDescription>;
        const RoleSystem = z.boolean();
        type RoleSystem = z.infer<typeof RoleSystem>;
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const OrderBy = z.enum([ 'name', 'display_name', 'modified', 'policyCount' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        export interface Params {
            uuid: Uuid;
            exclude?: Exclude;
            roleName?: RoleName;
            roleDisplayName?: RoleDisplayName;
            roleDescription?: RoleDescription;
            roleSystem?: RoleSystem;
            limit?: Limit;
            offset?: Offset;
            orderBy?: OrderBy;
        }

        export type Payload =
            | ValidatedResponse<
            'GroupRolesPagination',
            200,
            Schemas.GroupRolesPagination
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/roles/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.exclude !== undefined) {
                query.exclude = params.exclude;
            }

            if (params.roleName !== undefined) {
                query.role_name = params.roleName;
            }

            if (params.roleDisplayName !== undefined) {
                query.role_display_name = params.roleDisplayName;
            }

            if (params.roleDescription !== undefined) {
                query.role_description = params.roleDescription;
            }

            if (params.roleSystem !== undefined) {
                query.role_system = params.roleSystem;
            }

            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.GroupRolesPagination,
                            'GroupRolesPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /groups/{uuid}/roles/
    // Add a role to a group in the tenant
    export namespace AddRoleToGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Response200 = z.object({
            data: z.array(Schemas.RoleOut)
        });
        type Response200 = z.infer<typeof Response200>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.GroupRoleIn;
        }

        export type Payload =
            | ValidatedResponse<'unknown', 200, Response200>
            | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/roles/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Response200, 'unknown', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 400),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // DELETE /groups/{uuid}/roles/
    // Remove a role from a group in the tenant
    export namespace DeleteRoleFromGroup {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Roles = z.string();
        type Roles = z.infer<typeof Roles>;
        export interface Params {
            uuid: Uuid;
            roles: Roles;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/groups/{uuid}/roles/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.roles !== undefined) {
                query.roles = params.roles;
            }

            return actionBuilder('DELETE', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 204),
                        new ValidateRule(Schemas.__Empty, '__Empty', 400),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /permissions/
    // List the permissions for a tenant
    export namespace ListPermissions {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const OrderBy = z.enum([
            'application',
            'resource_type',
            'verb',
            'permission'
        ]);
        type OrderBy = z.infer<typeof OrderBy>;
        const Application = z.string();
        type Application = z.infer<typeof Application>;
        const ResourceType = z.string();
        type ResourceType = z.infer<typeof ResourceType>;
        const Verb = z.string();
        type Verb = z.infer<typeof Verb>;
        const Permission = z.string();
        type Permission = z.infer<typeof Permission>;
        const ExcludeGlobals = z.enum([ 'true', 'false' ]);
        type ExcludeGlobals = z.infer<typeof ExcludeGlobals>;
        const ExcludeRoles = z.string();
        type ExcludeRoles = z.infer<typeof ExcludeRoles>;
        const AllowedOnly = z.enum([ 'true', 'false' ]);
        type AllowedOnly = z.infer<typeof AllowedOnly>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            orderBy?: OrderBy;
            application?: Application;
            resourceType?: ResourceType;
            verb?: Verb;
            permission?: Permission;
            excludeGlobals?: ExcludeGlobals;
            excludeRoles?: ExcludeRoles;
            allowedOnly?: AllowedOnly;
        }

        export type Payload =
            | ValidatedResponse<
            'PermissionPagination',
            200,
            Schemas.PermissionPagination
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/permissions/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            if (params.application !== undefined) {
                query.application = params.application;
            }

            if (params.resourceType !== undefined) {
                query.resource_type = params.resourceType;
            }

            if (params.verb !== undefined) {
                query.verb = params.verb;
            }

            if (params.permission !== undefined) {
                query.permission = params.permission;
            }

            if (params.excludeGlobals !== undefined) {
                query.exclude_globals = params.excludeGlobals;
            }

            if (params.excludeRoles !== undefined) {
                query.exclude_roles = params.excludeRoles;
            }

            if (params.allowedOnly !== undefined) {
                query.allowed_only = params.allowedOnly;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.PermissionPagination,
                            'PermissionPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /permissions/options/
    // List the available options for fields of permissions for a tenant
    export namespace ListPermissionOptions {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const Field = z.enum([ 'application', 'resource_type', 'verb' ]);
        type Field = z.infer<typeof Field>;
        const Application = z.string();
        type Application = z.infer<typeof Application>;
        const ResourceType = z.string();
        type ResourceType = z.infer<typeof ResourceType>;
        const Verb = z.string();
        type Verb = z.infer<typeof Verb>;
        const ExcludeGlobals = z.enum([ 'true', 'false' ]);
        type ExcludeGlobals = z.infer<typeof ExcludeGlobals>;
        const AllowedOnly = z.enum([ 'true', 'false' ]);
        type AllowedOnly = z.infer<typeof AllowedOnly>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            field: Field;
            application?: Application;
            resourceType?: ResourceType;
            verb?: Verb;
            excludeGlobals?: ExcludeGlobals;
            allowedOnly?: AllowedOnly;
        }

        export type Payload =
            | ValidatedResponse<
            'PermissionOptionsPagination',
            200,
            Schemas.PermissionOptionsPagination
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/permissions/options/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.field !== undefined) {
                query.field = params.field;
            }

            if (params.application !== undefined) {
                query.application = params.application;
            }

            if (params.resourceType !== undefined) {
                query.resource_type = params.resourceType;
            }

            if (params.verb !== undefined) {
                query.verb = params.verb;
            }

            if (params.excludeGlobals !== undefined) {
                query.exclude_globals = params.excludeGlobals;
            }

            if (params.allowedOnly !== undefined) {
                query.allowed_only = params.allowedOnly;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.PermissionOptionsPagination,
                            'PermissionOptionsPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /policies/
    // List the policies in the tenant
    export namespace ListPolicies {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const Name = z.string();
        type Name = z.infer<typeof Name>;
        const Scope = z.enum([ 'account', 'principal' ]);
        type Scope = z.infer<typeof Scope>;
        const GroupName = z.string();
        type GroupName = z.infer<typeof GroupName>;
        const GroupUuid = z.string();
        type GroupUuid = z.infer<typeof GroupUuid>;
        const OrderBy = z.enum([ 'name', 'modified' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            name?: Name;
            scope?: Scope;
            groupName?: GroupName;
            groupUuid?: GroupUuid;
            orderBy?: OrderBy;
        }

        export type Payload =
            | ValidatedResponse<'PolicyPagination', 200, Schemas.PolicyPagination>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/policies/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.name !== undefined) {
                query.name = params.name;
            }

            if (params.scope !== undefined) {
                query.scope = params.scope;
            }

            if (params.groupName !== undefined) {
                query.group_name = params.groupName;
            }

            if (params.groupUuid !== undefined) {
                query.group_uuid = params.groupUuid;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.PolicyPagination, 'PolicyPagination', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /policies/
    // Create a policy in a tenant
    export namespace CreatePolicies {
        export interface Params {
            body: Schemas.PolicyIn;
        }

        export type Payload =
            | ValidatedResponse<'PolicyExtended', 201, Schemas.PolicyExtended>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/policies/';
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.PolicyExtended, 'PolicyExtended', 201),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /policies/{uuid}/
    // Get a policy in the tenant
    export namespace GetPolicy {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
        }

        export type Payload =
            | ValidatedResponse<'PolicyExtended', 200, Schemas.PolicyExtended>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/policies/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.PolicyExtended, 'PolicyExtended', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // PUT /policies/{uuid}/
    // Update a policy in the tenant
    export namespace UpdatePolicy {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.PolicyIn;
        }

        export type Payload =
            | ValidatedResponse<'PolicyExtended', 200, Schemas.PolicyExtended>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/policies/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('PUT', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.PolicyExtended, 'PolicyExtended', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // DELETE /policies/{uuid}/
    // Delete a policy in the tenant
    export namespace DeletePolicy {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/policies/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('DELETE', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 204),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /principals/
    // List the principals for a tenant
    export namespace ListPrincipals {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const MatchCriteria = z.enum([ 'partial', 'exact' ]);
        type MatchCriteria = z.infer<typeof MatchCriteria>;
        const Usernames = z.string();
        type Usernames = z.infer<typeof Usernames>;
        const SortOrder = z.enum([ 'asc', 'desc' ]);
        type SortOrder = z.infer<typeof SortOrder>;
        const Email = z.string();
        type Email = z.infer<typeof Email>;
        const Status = z.enum([ 'enabled', 'disabled', 'all' ]);
        type Status = z.infer<typeof Status>;
        const AdminOnly = z.enum([ 'true', 'false' ]);
        type AdminOnly = z.infer<typeof AdminOnly>;
        const OrderBy = z.enum([ 'username' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            matchCriteria?: MatchCriteria;
            usernames?: Usernames;
            sortOrder?: SortOrder;
            email?: Email;
            status?: Status;
            adminOnly?: AdminOnly;
            orderBy?: OrderBy;
        }

        export type Payload =
            | ValidatedResponse<
            'PrincipalPagination',
            200,
            Schemas.PrincipalPagination
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/principals/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.matchCriteria !== undefined) {
                query.match_criteria = params.matchCriteria;
            }

            if (params.usernames !== undefined) {
                query.usernames = params.usernames;
            }

            if (params.sortOrder !== undefined) {
                query.sort_order = params.sortOrder;
            }

            if (params.email !== undefined) {
                query.email = params.email;
            }

            if (params.status !== undefined) {
                query.status = params.status;
            }

            if (params.adminOnly !== undefined) {
                query.admin_only = params.adminOnly;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.PrincipalPagination,
                            'PrincipalPagination',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /roles/
    // List the roles for a tenant
    export namespace ListRoles {
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        const Name = z.string();
        type Name = z.infer<typeof Name>;
        const System = z.boolean();
        type System = z.infer<typeof System>;
        const DisplayName = z.string();
        type DisplayName = z.infer<typeof DisplayName>;
        const NameMatch = z.enum([ 'partial', 'exact' ]);
        type NameMatch = z.infer<typeof NameMatch>;
        const Scope = z.enum([ 'account', 'principal' ]);
        type Scope = z.infer<typeof Scope>;
        const OrderBy = z.enum([ 'name', 'display_name', 'modified', 'policyCount' ]);
        type OrderBy = z.infer<typeof OrderBy>;
        const AddFields = z.array(z.enum([ 'groups_in', 'groups_in_count' ]));
        type AddFields = z.infer<typeof AddFields>;
        const Username = z.string();
        type Username = z.infer<typeof Username>;
        const Application = z.string();
        type Application = z.infer<typeof Application>;
        const Permission = z.string();
        type Permission = z.infer<typeof Permission>;
        export interface Params {
            limit?: Limit;
            offset?: Offset;
            name?: Name;
            system?: System;
            displayName?: DisplayName;
            nameMatch?: NameMatch;
            scope?: Scope;
            orderBy?: OrderBy;
            addFields?: AddFields;
            username?: Username;
            application?: Application;
            permission?: Permission;
        }

        export type Payload =
            | ValidatedResponse<
            'RolePaginationDynamic',
            200,
            Schemas.RolePaginationDynamic
            >
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/';
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            if (params.name !== undefined) {
                query.name = params.name;
            }

            if (params.system !== undefined) {
                query.system = params.system;
            }

            if (params.displayName !== undefined) {
                query.display_name = params.displayName;
            }

            if (params.nameMatch !== undefined) {
                query.name_match = params.nameMatch;
            }

            if (params.scope !== undefined) {
                query.scope = params.scope;
            }

            if (params.orderBy !== undefined) {
                query.order_by = params.orderBy;
            }

            if (params.addFields !== undefined) {
                query.add_fields = params.addFields;
            }

            if (params.username !== undefined) {
                query.username = params.username;
            }

            if (params.application !== undefined) {
                query.application = params.application;
            }

            if (params.permission !== undefined) {
                query.permission = params.permission;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(
                            Schemas.RolePaginationDynamic,
                            'RolePaginationDynamic',
                            200
                        ),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // POST /roles/
    // Create a roles for a tenant
    export namespace CreateRoles {
        export interface Params {
            body: Schemas.RoleIn;
        }

        export type Payload =
            | ValidatedResponse<'RoleWithAccess', 201, Schemas.RoleWithAccess>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/';
            const query = {} as Record<string, any>;
            return actionBuilder('POST', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.RoleWithAccess, 'RoleWithAccess', 201),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /roles/{uuid}/
    // Get a role in the tenant
    export namespace GetRole {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Scope = z.enum([ 'account', 'principal' ]);
        type Scope = z.infer<typeof Scope>;
        export interface Params {
            uuid: Uuid;
            scope?: Scope;
        }

        export type Payload =
            | ValidatedResponse<'RoleWithAccess', 200, Schemas.RoleWithAccess>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.scope !== undefined) {
                query.scope = params.scope;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.RoleWithAccess, 'RoleWithAccess', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // PUT /roles/{uuid}/
    // Update a Role in the tenant
    export namespace UpdateRole {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
            body: Schemas.RoleWithAccess;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('PUT', path)
                .queryParams(query)
                .data(params.body)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // DELETE /roles/{uuid}/
    // Delete a role in the tenant
    export namespace DeleteRole {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        export interface Params {
            uuid: Uuid;
        }

        export type Payload =
            | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/{uuid}/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            return actionBuilder('DELETE', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.__Empty, '__Empty', 204),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /roles/{uuid}/access/
    // Get access for a role in the tenant
    export namespace GetRoleAccess {
        const Uuid = z.string();
        type Uuid = z.infer<typeof Uuid>;
        const Limit = z.number().int();
        type Limit = z.infer<typeof Limit>;
        const Offset = z.number().int();
        type Offset = z.infer<typeof Offset>;
        export interface Params {
            uuid: Uuid;
            limit?: Limit;
            offset?: Offset;
        }

        export type Payload =
            | ValidatedResponse<'AccessPagination', 200, Schemas.AccessPagination>
            | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
            | ValidatedResponse<'Error403', 403, Schemas.Error403>
            | ValidatedResponse<'Error', 404, Schemas.Error>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (params: Params): ActionCreator => {
            const path = '/api/rbac/v1/roles/{uuid}/access/'.replace(
                '{uuid}',
                params.uuid.toString()
            );
            const query = {} as Record<string, any>;
            if (params.limit !== undefined) {
                query.limit = params.limit;
            }

            if (params.offset !== undefined) {
                query.offset = params.offset;
            }

            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.AccessPagination, 'AccessPagination', 200),
                        new ValidateRule(Schemas.__Empty, '__Empty', 401),
                        new ValidateRule(Schemas.Error403, 'Error403', 403),
                        new ValidateRule(Schemas.Error, 'Error', 404),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
    // GET /status/
    // Obtain server status
    export namespace GetStatus {
        export type Payload =
            | ValidatedResponse<'Status', 200, Schemas.Status>
            | ValidatedResponse<'Error', 500, Schemas.Error>
            | ValidatedResponse<'unknown', undefined, unknown>;
        export type ActionCreator = Action<Payload, ActionValidatableConfig>;
        export const actionCreator = (): ActionCreator => {
            const path = '/api/rbac/v1/status/';
            const query = {} as Record<string, any>;
            return actionBuilder('GET', path)
                .queryParams(query)
                .config({
                    rules: [
                        new ValidateRule(Schemas.Status, 'Status', 200),
                        new ValidateRule(Schemas.Error, 'Error', 500)
                    ]
                })
                .build();
        };
    }
}
