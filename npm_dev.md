# NPM Module Development

To work on this npm module locally without having to publish it every time you make changes, you can follow these steps to link the module to your project. This allows you to test changes in real-time without needing to re-publish the module.

### 1. Set Up the Module Locally
First, navigate to vue-model module's (this) directory and run:

```bash
npm link
```

This creates a symbolic link in the global `node_modules` directory.

### 2. Link the Module in Your Project
Next, navigate to your project's directory and run:

```bash
npm link @bobanum/vue-model
```

Replace `@bobanum/vue-model` with the actual name of your module. This links the global symbolic link to your project’s `node_modules` directory.

### 3. Develop and Test
Now you can develop your npm module. Any changes you make to the module will be reflected in your project without needing to re-publish the module.

### 4. Unlinking When Done
When you're ready to unlink the module, you can do the following:

In your project directory:

```bash
npm unlink your-module-name
```

Then in your module's directory:

```bash
npm unlink
```

This will remove the symbolic links and allow you to install the module as a regular dependency when you're ready to publish it.
