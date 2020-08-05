function init(Survey, $) {
    $ = $ || window.$;

    if (!$.fn.bootstrapDP && !!$.fn.datepicker && !!$.fn.datepicker.noConflict) {
        $.fn.bootstrapDP = $.fn.datepicker.noConflict();
        if (!$.fn.datepicker) {
            $.fn.datepicker = $.fn.bootstrapDP;
        }
    }
    var widget = {
        name: "bootstrapdatepicker",
        title: "Date picker",
        iconName: "icon-datepicker",
        widgetIsLoaded: function () {
            return !!$.fn.bootstrapDP;
        },
        isFit: function (question) {
            return question.getType() === "bootstrapdatepicker";
        },
        htmlTemplate:
            "<input class='form-control widget-datepicker' type='text' style='width: 100%;' readonly>",
        activatedByChanged: function (activatedBy) {
            Survey.JsonObject.metaData.addClass(
                "bootstrapdatepicker",
                [
                    { name: "inputType", visible: false },
                    { name: "inputFormat", visible: false },
                    { name: "inputMask", visible: false }
                ],
                null,
                "text"
            );
            Survey.JsonObject.metaData.addProperties("bootstrapdatepicker", [
                {
                    // Can take a string or an Object.
                    // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#format
                    name: "dateFormat",
                    default: "'mm/dd/yyyy'"
                },
                {
                    // Can take a Date or a string
                    // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#options
                    name: "startDate",
                    default: ""
                },
                {
                    // Can take a Date or a string
                    // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#options
                    name: "endDate",
                    default: ""
                },
                {
                    name: "todayHighlight:boolean",
                    default: true,
                },
                {
                    name: "weekStart:number",
                    default: 0
                },
                {
                    name: "clearBtn:boolean",
                    default: false
                },
                {
                    name: "autoClose:boolean",
                    default: true,
                },
                {
                    name: "daysOfWeekHighlighted:string",
                    default: ""
                },
                {
                    name: "disableTouchKeyboard:boolean",
                    default: true
                }
            ]);
        },
        afterRender: function (question, el) {
            var $el = $(el).is(".widget-datepicker")
                ? $(el)
                : $(el).find(".widget-datepicker");

            var pickerWidget = $el.bootstrapDP({
                enableOnReadonly: false,
                format: question.dateFormat,
                startDate: question.startDate,
                endDate: question.endDate,
                todayHighlight: question.todayHighlight,
                weekStart: question.weekStart,
                clearBtn: question.clearBtn,
                autoclose: question.autoClose,
                daysOfWeekHighlighted: question.daysOfWeekHighlighted,
                disableTouchKeyboard: question.disableTouchKeyboard
            })
            // .on("changeDate", function (e) {
            //     question.value = moment(e.date).format("DD/MM/YYYY");
            //     // `e` here contains the extra attributes
            // })
            .on("change", function (e) {
                var newValue = pickerWidget.val();
                if(question.value != newValue) {
                    question.value = newValue;
                }
            });

            question.valueChangedCallback = function () {
                pickerWidget.val(question.value);
                // $el.bootstrapDP('update', moment(question.value, "DD/MM/YYYY").toDate());
            }
            question.valueChangedCallback();
            question.readOnlyChangedCallback = function () {
                if (question.isReadOnly) {
                    $el.prop('readonly', true);
                }
                else {
                    $el.removeAttr('readonly');
                }
            }
            question.readOnlyChangedCallback();

        },
        willUnmount: function (question, el) {
            var $el = $(el).is(".widget-datepicker")
                ? $(el)
                : $(el).find(".widget-datepicker");
            $el.bootstrapDP("destroy");
            question.readOnlyChangedCallback = undefined;
            question.valueChangedCallback = undefined;
        },
        pdfQuestionType: "text"
    };

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
    init(Survey, window.$);
}

export default init;
