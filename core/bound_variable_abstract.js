/**
 * @fileoverview Variable representation with variable binding.
 * This is an abstract class for Blockly.BoundVariableValue and
 * Blockly.BoundVariableReference.
 * @author harukam0416@gmail.com (Haruka Matsumoto)
 */
'use strict';

goog.provide('Blockly.BoundVariableAbstract');

goog.require('goog.string');


/**
 * Class for a variable to implement variable binding.
 * @param {!Blockly.Block} block The block of this variable.
 * @param {!string} fieldName The name of the main field this variable is
 *     bound to.
 * @param {!Blockly.TypeExpr} typeExpr The type expression of this
 *     variable.
 * @param {!number} label The enum representing type of variable.
 * @constructor
 */
Blockly.BoundVariableAbstract = function(block, fieldName, typeExpr, label) {
  /**
   * The block the variable is declared in.
   * @type {!Blockly.Block}
   */
  this.sourceBlock_ = block;

  /**
   * The workspace of this variable's block.
   * @type {!Blockly.Workspace}
   */
  this.workspace_ = this.sourceBlock_.workspace;

  /**
   * The name of the main field name on the block.
   * @type {string}
   */
  this.mainFieldName_ = fieldName;

  /**
   * The type expression of this variable.
   * @type {Blockly.TypeExpr}
   */
  this.typeExpr_ = typeExpr;

  /**
   * The enum representing type of variable.
   * @type {number}
   */
  this.label = label;

  /**
   * The list of sub field names which the variable is bound to.
   * @type {!Array.<string>}
   * @private
   */
  this.subFieldNames_ = [];

  /**
   * A unique id for the variable.
   * @type {string}
   * @private
   */
  this.id_ = Blockly.utils.genUid();

  /**
   * Whether the variable has been added to the variable database of the
   * workspace.
   * @type {boolean}
   */
  this.inWorkspaceDB = false;

  /**
   * Whether the variable has been added to the variable map of any block.
   * @type {boolean}
   */
  this.inBlockDB = false;
};

/**
 * Get the source block for this varialbe.
 * @return {!Blockly.Block} The source block
 */
Blockly.BoundVariableAbstract.prototype.getSourceBlock = function() {
  return this.sourceBlock_;
};

/**
 * Get the workspace of this variable's source block.
 * @return {!Blockly.Workspace} The source block's workspace, or null.
 */
Blockly.BoundVariableAbstract.prototype.getWorkspace = function() {
  return this.workspace_;
};

/**
 * Functions to return the name of the field this variable is bound to.
 * @return {!string} The name of this variable's field.
 */
Blockly.BoundVariableAbstract.prototype.getMainFieldName = function() {
  return this.mainFieldName_;
};
Blockly.BoundVariableAbstract.prototype.getSubFieldName = function(index) {
  return this.subFieldNames_[index];
};

/**
 * Functions to return the field this variable is bound to.
 * @return {!Blockly.FieldBoundVariable} This variable's field.
 */
Blockly.BoundVariableAbstract.prototype.getMainField = function() {
  return this.sourceBlock_.getField(this.mainFieldName_);
};
Blockly.BoundVariableAbstract.prototype.getSubField = function(index) {
  var name = this.getSubFieldName(index);
  if (name) {
    return this.sourceBlock_.getField(name);
  }
  throw 'The sub field index is out of bounds.';
};

/**
 * Functions to modify this variable's sub fields.
 */
Blockly.BoundVariableAbstract.prototype.addSubField = function(name) {
  if (!name) {
    throw 'The sub field name can not be empty.';
  }
  if (this.subFieldNames_.indexOf(name) != -1) {
    throw 'The sub field name must be unique.';
  }
  this.subFieldNames_.push(name);
};
Blockly.BoundVariableAbstract.prototype.removeSubField = function(name) {
  goog.array.removeLast(this.subFieldNames_, name);
};

/**
 * Returns the type expression of this variable.
 * @return {Blockly.TypeExpr} The type expression of this variable, or null.
 */
Blockly.BoundVariableAbstract.prototype.getTypeExpr = function() {
  return this.typeExpr_;
};

/**
 * Store the given type expression in this variable.
 * @param {Blockly.TypeExpr|null} typeExpr The type expression to be stored in
 *     this variable, or could be null if another block takes the place of the
 *     block.
 */
Blockly.BoundVariableAbstract.prototype.setTypeExpr = function(typeExpr) {
  this.typeExpr_ = typeExpr;
};

/**
 * Restore the bindings on the type expressions.
 */
Blockly.BoundVariableAbstract.prototype.unifyTypeExpr = undefined;

/**
 * Returns if this variable is a reference.
 * @return {boolean} True if this variable is a reference.
 */
Blockly.BoundVariableAbstract.prototype.isReference = undefined;

/**
 * @return {!string} The ID for the variable.
 */
Blockly.BoundVariableAbstract.prototype.getId = function() {
  return this.id_;
};

Blockly.BoundVariableAbstract.VARIABLE = 1;
Blockly.BoundVariableAbstract.CONSTRUCTOR = 3;
Blockly.BoundVariableAbstract.RECORD = 5;

Blockly.BoundVariableAbstract._LABEL_LIST = [
  Blockly.BoundVariableAbstract.VARIABLE,
  Blockly.BoundVariableAbstract.CONSTRUCTOR,
  Blockly.BoundVariableAbstract.RECORD
];

/**
 * Functions to return if the variable is of the specified type.
 */
Blockly.BoundVariableAbstract.prototype.isVariable = function() {
  return this.label == Blockly.BoundVariableAbstract.VARIABLE;
};
Blockly.BoundVariableAbstract.prototype.isConstructor = function() {
  return this.label == Blockly.BoundVariableAbstract.CONSTRUCTOR;
};
Blockly.BoundVariableAbstract.prototype.isRecord = function() {
  return this.label == Blockly.BoundVariableAbstract.RECORD;
};
Blockly.BoundVariableAbstract.isValidLabel = function(label) {
  return Blockly.BoundVariableAbstract._LABEL_LIST.indexOf(label) != -1;
};
Blockly.BoundVariableAbstract.isVariableLabel = function(label) {
  return label == Blockly.BoundVariableAbstract.VARIABLE;
};
Blockly.BoundVariableAbstract.isConstructorLabel = function(label) {
  return label == Blockly.BoundVariableAbstract.CONSTRUCTOR;
};

/**
 * Get the variable name for this variable.
 * @return {!string} This variable's name.
 */
Blockly.BoundVariableAbstract.prototype.getVariableName = undefined;

/**
 * Set the variable name for this variable.
 * @param {!string} newName The new name for this variable.
 */
Blockly.BoundVariableAbstract.prototype.setVariableName = undefined;

/**
 * Returns a list of variables which refer to the same value, or are referred
 * to by them.  Includes this variable in the list.
 * @return {Array.<!Blockly.BoundVariableAbstract>} A list of variables.
 */
Blockly.BoundVariableAbstract.prototype.getAllBoundVariables = function() {
  return [this];
};

/**
 * Dispose of this variable.
 */
Blockly.BoundVariableAbstract.prototype.dispose = function() {
  this.sourceBlock_ = null;
  this.workspace_ = null;
  this.typeExpr_ = null;
};

/**
 * A custom compare function for the BoundVariableAbstract objects.
 * @param {Blockly.VariableModel} var1 First variable to compare.
 * @param {Blockly.VariableModel} var2 Second variable to compare.
 * @return {number} -1 if name of var1 is less than name of var2, 0 if equal,
 *     and 1 if greater.
 * @package
 */
Blockly.BoundVariableAbstract.compareByName = function(var1, var2) {
  return goog.string.caseInsensitiveCompare(var1.getVariableName(),
      var2.getVariableName());
};
