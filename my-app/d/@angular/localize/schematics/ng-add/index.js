/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for ng-new project that builds with Bazel.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/schematics/ng-add", ["require", "exports", "tslib", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@schematics/angular/utility/dependencies", "@schematics/angular/utility/workspace", "@schematics/angular/utility/workspace-models"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizePolyfill = void 0;
    const tslib_1 = require("tslib");
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const dependencies_1 = require("@schematics/angular/utility/dependencies");
    const workspace_1 = require("@schematics/angular/utility/workspace");
    const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
    exports.localizePolyfill = `import '@angular/localize/init';`;
    function getRelevantTargetDefinitions(project, builderName) {
        const definitions = [];
        project.targets.forEach((target) => {
            if (target.builder === builderName) {
                definitions.push(target);
            }
        });
        return definitions;
    }
    function getOptionValuesForTargetDefinition(definition, optionName) {
        const optionValues = [];
        if (definition.options && optionName in definition.options) {
            let optionValue = definition.options[optionName];
            if (typeof optionValue === 'string') {
                optionValues.push(optionValue);
            }
        }
        if (!definition.configurations) {
            return optionValues;
        }
        Object.values(definition.configurations)
            .forEach((configuration) => {
            if (configuration && optionName in configuration) {
                const optionValue = configuration[optionName];
                if (typeof optionValue === 'string') {
                    optionValues.push(optionValue);
                }
            }
        });
        return optionValues;
    }
    function getFileListForRelevantTargetDefinitions(project, builderName, optionName) {
        const fileList = [];
        const definitions = getRelevantTargetDefinitions(project, builderName);
        definitions.forEach((definition) => {
            const optionValues = getOptionValuesForTargetDefinition(definition, optionName);
            optionValues.forEach((filePath) => {
                if (fileList.indexOf(filePath) === -1) {
                    fileList.push(filePath);
                }
            });
        });
        return fileList;
    }
    function prependToTargetFiles(project, builderName, optionName, str) {
        return (host) => {
            const fileList = getFileListForRelevantTargetDefinitions(project, builderName, optionName);
            fileList.forEach((path) => {
                const data = host.read(path);
                if (!data) {
                    // If the file doesn't exist, just ignore it.
                    return;
                }
                const content = core_1.virtualFs.fileBufferToString(data);
                if (content.includes(exports.localizePolyfill) ||
                    content.includes(exports.localizePolyfill.replace(/'/g, '"'))) {
                    // If the file already contains the polyfill (or variations), ignore it too.
                    return;
                }
                // Add string at the start of the file.
                const recorder = host.beginUpdate(path);
                recorder.insertLeft(0, str);
                host.commitUpdate(recorder);
            });
        };
    }
    function moveToDependencies(host, context) {
        if (host.exists('package.json')) {
            // Remove the previous dependency and add in a new one under the desired type.
            (0, dependencies_1.removePackageJsonDependency)(host, '@angular/localize');
            (0, dependencies_1.addPackageJsonDependency)(host, {
                name: '@angular/localize',
                type: dependencies_1.NodeDependencyType.Default,
                version: `~13.3.6`
            });
            // Add a task to run the package manager. This is necessary because we updated
            // "package.json" and we want lock files to reflect this.
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
    }
    function default_1(options) {
        return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!options.name) {
                throw new schematics_1.SchematicsException('Option "name" is required.');
            }
            const workspace = yield (0, workspace_1.getWorkspace)(host);
            const project = workspace.projects.get(options.name);
            if (!project) {
                throw new schematics_1.SchematicsException(`Invalid project name (${options.name})`);
            }
            const localizeStr = `/***************************************************************************************************
 * Load \`$localize\` onto the global scope - used if i18n tags appear in Angular templates.
 */
${exports.localizePolyfill}
`;
            return (0, schematics_1.chain)([
                prependToTargetFiles(project, workspace_models_1.Builders.Browser, 'polyfills', localizeStr),
                prependToTargetFiles(project, workspace_models_1.Builders.Server, 'main', localizeStr),
                // If `$localize` will be used at runtime then must install `@angular/localize`
                // into `dependencies`, rather than the default of `devDependencies`.
                options.useAtRuntime ? moveToDependencies : (0, schematics_1.noop)()
            ]);
        });
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zY2hlbWF0aWNzL25nLWFkZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBMkQ7SUFDM0QsMkRBQTBHO0lBQzFHLDREQUF3RTtJQUN4RSwyRUFBbUk7SUFDbkkscUVBQW1FO0lBQ25FLG1GQUFzRTtJQUt6RCxRQUFBLGdCQUFnQixHQUFHLGtDQUFrQyxDQUFDO0lBRW5FLFNBQVMsNEJBQTRCLENBQ2pDLE9BQXFDLEVBQUUsV0FBcUI7UUFDOUQsTUFBTSxXQUFXLEdBQWtDLEVBQUUsQ0FBQztRQUN0RCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQW1DLEVBQVEsRUFBRTtZQUNwRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO2dCQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyxrQ0FBa0MsQ0FDdkMsVUFBdUMsRUFBRSxVQUFrQjtRQUM3RCxNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQzFELElBQUksV0FBVyxHQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDaEM7U0FDRjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO1lBQzlCLE9BQU8sWUFBWSxDQUFDO1NBQ3JC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TExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3IFNjaGVtYXRpY3MgZm9yIG5nLW5ldyBwcm9qZWN0IHRoYXQgYnVpbGRzIHdpdGggQmF6ZWwuXG4gKi9cblxuaW1wb3J0IHt2aXJ0dWFsRnMsIHdvcmtzcGFjZXN9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlSnNvbkRlcGVuZGVuY3ksIE5vZGVEZXBlbmRlbmN5VHlwZSwgcmVtb3ZlUGFja2FnZUpzb25EZXBlbmRlbmN5fSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7QnVpbGRlcnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcblxuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuXG5leHBvcnQgY29uc3QgbG9jYWxpemVQb2x5ZmlsbCA9IGBpbXBvcnQgJ0Bhbmd1bGFyL2xvY2FsaXplL2luaXQnO2A7XG5cbmZ1bmN0aW9uIGdldFJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMoXG4gICAgcHJvamVjdDogd29ya3NwYWNlcy5Qcm9qZWN0RGVmaW5pdGlvbiwgYnVpbGRlck5hbWU6IEJ1aWxkZXJzKTogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uW10ge1xuICBjb25zdCBkZWZpbml0aW9uczogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uW10gPSBbXTtcbiAgcHJvamVjdC50YXJnZXRzLmZvckVhY2goKHRhcmdldDogd29ya3NwYWNlcy5UYXJnZXREZWZpbml0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRhcmdldC5idWlsZGVyID09PSBidWlsZGVyTmFtZSkge1xuICAgICAgZGVmaW5pdGlvbnMucHVzaCh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZWZpbml0aW9ucztcbn1cblxuZnVuY3Rpb24gZ2V0T3B0aW9uVmFsdWVzRm9yVGFyZ2V0RGVmaW5pdGlvbihcbiAgICBkZWZpbml0aW9uOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24sIG9wdGlvbk5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3B0aW9uVmFsdWVzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoZGVmaW5pdGlvbi5vcHRpb25zICYmIG9wdGlvbk5hbWUgaW4gZGVmaW5pdGlvbi5vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvblZhbHVlOiB1bmtub3duID0gZGVmaW5pdGlvbi5vcHRpb25zW29wdGlvbk5hbWVdO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25WYWx1ZXMucHVzaChvcHRpb25WYWx1ZSk7XG4gICAgfVxuICB9XG4gIGlmICghZGVmaW5pdGlvbi5jb25maWd1cmF0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25WYWx1ZXM7XG4gIH1cbiAgT2JqZWN0LnZhbHVlcyhkZWZpbml0aW9uLmNvbmZpZ3VyYXRpb25zKVxuICAgICAgLmZvckVhY2goKGNvbmZpZ3VyYXRpb246IFJlY29yZDxzdHJpbmcsIHVua25vd24+fHVuZGVmaW5lZCk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoY29uZmlndXJhdGlvbiAmJiBvcHRpb25OYW1lIGluIGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZTogdW5rbm93biA9IGNvbmZpZ3VyYXRpb25bb3B0aW9uTmFtZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvblZhbHVlcy5wdXNoKG9wdGlvblZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICByZXR1cm4gb3B0aW9uVmFsdWVzO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlTGlzdEZvclJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMoXG4gICAgcHJvamVjdDogd29ya3NwYWNlcy5Qcm9qZWN0RGVmaW5pdGlvbiwgYnVpbGRlck5hbWU6IEJ1aWxkZXJzLCBvcHRpb25OYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZpbGVMaXN0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBkZWZpbml0aW9ucyA9IGdldFJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMocHJvamVjdCwgYnVpbGRlck5hbWUpO1xuICBkZWZpbml0aW9ucy5mb3JFYWNoKChkZWZpbml0aW9uOiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24pOiB2b2lkID0+IHtcbiAgICBjb25zdCBvcHRpb25WYWx1ZXMgPSBnZXRPcHRpb25WYWx1ZXNGb3JUYXJnZXREZWZpbml0aW9uKGRlZmluaXRpb24sIG9wdGlvbk5hbWUpO1xuICAgIG9wdGlvblZhbHVlcy5mb3JFYWNoKChmaWxlUGF0aDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICBpZiAoZmlsZUxpc3QuaW5kZXhPZihmaWxlUGF0aCkgPT09IC0xKSB7XG4gICAgICAgIGZpbGVMaXN0LnB1c2goZmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGZpbGVMaXN0O1xufVxuXG5mdW5jdGlvbiBwcmVwZW5kVG9UYXJnZXRGaWxlcyhcbiAgICBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9uLCBidWlsZGVyTmFtZTogQnVpbGRlcnMsIG9wdGlvbk5hbWU6IHN0cmluZywgc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBnZXRGaWxlTGlzdEZvclJlbGV2YW50VGFyZ2V0RGVmaW5pdGlvbnMocHJvamVjdCwgYnVpbGRlck5hbWUsIG9wdGlvbk5hbWUpO1xuXG4gICAgZmlsZUxpc3QuZm9yRWFjaCgocGF0aDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gaG9zdC5yZWFkKHBhdGgpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIC8vIElmIHRoZSBmaWxlIGRvZXNuJ3QgZXhpc3QsIGp1c3QgaWdub3JlIGl0LlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGRhdGEpO1xuICAgICAgaWYgKGNvbnRlbnQuaW5jbHVkZXMobG9jYWxpemVQb2x5ZmlsbCkgfHxcbiAgICAgICAgICBjb250ZW50LmluY2x1ZGVzKGxvY2FsaXplUG9seWZpbGwucmVwbGFjZSgvJy9nLCAnXCInKSkpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpbGUgYWxyZWFkeSBjb250YWlucyB0aGUgcG9seWZpbGwgKG9yIHZhcmlhdGlvbnMpLCBpZ25vcmUgaXQgdG9vLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBzdHJpbmcgYXQgdGhlIHN0YXJ0IG9mIHRoZSBmaWxlLlxuICAgICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHBhdGgpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdCgwLCBzdHIpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtb3ZlVG9EZXBlbmRlbmNpZXMoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkge1xuICBpZiAoaG9zdC5leGlzdHMoJ3BhY2thZ2UuanNvbicpKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBwcmV2aW91cyBkZXBlbmRlbmN5IGFuZCBhZGQgaW4gYSBuZXcgb25lIHVuZGVyIHRoZSBkZXNpcmVkIHR5cGUuXG4gICAgcmVtb3ZlUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsICdAYW5ndWxhci9sb2NhbGl6ZScpO1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICBuYW1lOiAnQGFuZ3VsYXIvbG9jYWxpemUnLFxuICAgICAgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLkRlZmF1bHQsXG4gICAgICB2ZXJzaW9uOiBgfjAuMC4wLVBMQUNFSE9MREVSYFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGEgdGFzayB0byBydW4gdGhlIHBhY2thZ2UgbWFuYWdlci4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB3ZSB1cGRhdGVkXG4gICAgLy8gXCJwYWNrYWdlLmpzb25cIiBhbmQgd2Ugd2FudCBsb2NrIGZpbGVzIHRvIHJlZmxlY3QgdGhpcy5cbiAgICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignT3B0aW9uIFwibmFtZVwiIGlzIHJlcXVpcmVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0OiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9ufHVuZGVmaW5lZCA9IHdvcmtzcGFjZS5wcm9qZWN0cy5nZXQob3B0aW9ucy5uYW1lKTtcbiAgICBpZiAoIXByb2plY3QpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBJbnZhbGlkIHByb2plY3QgbmFtZSAoJHtvcHRpb25zLm5hbWV9KWApO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsaXplU3RyID1cbiAgICAgICAgYC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIExvYWQgXFxgJGxvY2FsaXplXFxgIG9udG8gdGhlIGdsb2JhbCBzY29wZSAtIHVzZWQgaWYgaTE4biB0YWdzIGFwcGVhciBpbiBBbmd1bGFyIHRlbXBsYXRlcy5cbiAqL1xuJHtsb2NhbGl6ZVBvbHlmaWxsfVxuYDtcblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBwcmVwZW5kVG9UYXJnZXRGaWxlcyhwcm9qZWN0LCBCdWlsZGVycy5Ccm93c2VyLCAncG9seWZpbGxzJywgbG9jYWxpemVTdHIpLFxuICAgICAgcHJlcGVuZFRvVGFyZ2V0RmlsZXMocHJvamVjdCwgQnVpbGRlcnMuU2VydmVyLCAnbWFpbicsIGxvY2FsaXplU3RyKSxcbiAgICAgIC8vIElmIGAkbG9jYWxpemVgIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRoZW4gbXVzdCBpbnN0YWxsIGBAYW5ndWxhci9sb2NhbGl6ZWBcbiAgICAgIC8vIGludG8gYGRlcGVuZGVuY2llc2AsIHJhdGhlciB0aGFuIHRoZSBkZWZhdWx0IG9mIGBkZXZEZXBlbmRlbmNpZXNgLlxuICAgICAgb3B0aW9ucy51c2VBdFJ1bnRpbWUgPyBtb3ZlVG9EZXBlbmRlbmNpZXMgOiBub29wKClcbiAgICBdKTtcbiAgfTtcbn1cbiJdfQ==