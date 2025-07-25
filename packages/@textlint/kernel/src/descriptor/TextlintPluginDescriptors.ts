"use strict";
import { TextlintKernelPlugin } from "../textlint-kernel-interface.js";
import { TextlintPluginDescriptor } from "./TextlintPluginDescriptor.js";
import { filterDuplicateDescriptor } from "./DescriptorUtil.js";

/**
 * Collection class of TextlintPluginDescriptor
 */
export class TextlintPluginDescriptors {
    constructor(private pluginDescriptorList: TextlintPluginDescriptor[] = []) {}

    /**
     * Return enabled descriptors
     */
    get descriptors() {
        return this.pluginDescriptorList.filter((descriptor) => {
            return descriptor.enabled;
        });
    }

    /**
     * Return all descriptors that include disabled descriptors
     */
    get allDescriptors() {
        return this.pluginDescriptorList;
    }

    /**
     * Return available extensions
     * It is not includes disabled plugin's extensions.
     */
    get availableExtensions(): string[] {
        return this.descriptors.reduce((extensions, descriptor) => {
            return extensions.concat(descriptor.availableExtensions);
        }, [] as string[]);
    }

    /**
     * find PluginDescriptor with extension.
     * This is forward match.
     */
    findPluginDescriptorWithExt(ext: string) {
        return this.descriptors.find((descriptor) => {
            return descriptor.availableExtensions.some((availableExtension) => ext.endsWith(availableExtension));
        });
    }

    /**
     * filter duplicated descriptors
     */
    withoutDuplicated() {
        const newDescriptorList = filterDuplicateDescriptor(this.pluginDescriptorList);
        return new TextlintPluginDescriptors(newDescriptorList);
    }

    /**
     * Convert this to TextlintKernel rules format
     * @returns {Array}
     */
    toKernelPluginsFormat(): TextlintKernelPlugin[] {
        return this.descriptors.map((descriptor) => {
            return descriptor.toKernel();
        });
    }

    toJSON() {
        return this.descriptors.map((descriptor) => {
            return descriptor.toJSON();
        });
    }
}
