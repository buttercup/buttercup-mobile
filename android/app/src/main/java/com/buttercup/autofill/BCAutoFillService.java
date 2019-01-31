package com.buttercup.autofill;

import android.annotation.TargetApi;
import android.app.assist.AssistStructure;
import android.os.Build;
import android.os.CancellationSignal;
import android.service.autofill.AutofillService;
import android.service.autofill.Dataset;
import android.service.autofill.FillCallback;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.service.autofill.SaveCallback;
import android.service.autofill.SaveRequest;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;

import java.util.List;

@TargetApi(Build.VERSION_CODES.O)
public class BCAutoFillService extends AutofillService {
    private static final String TAG = "BCAutoFillService";
    @Override
    public void onFillRequest(@NonNull FillRequest request,
                              @NonNull CancellationSignal cancellationSignal, @NonNull FillCallback callback) {
        Log.d(TAG, "onFillRequest");

        // Get the structure from the request
        List<FillContext> context = request.getFillContexts();
        AssistStructure structure = context.get(context.size() - 1).getStructure();

        // Parse the structure into fillable view IDs
        StructureParser.Result parseResult = new StructureParser(structure).parse();

        // Build the presentation of the datasets
        RemoteViews remoteView = new RemoteViews(getPackageName(), android.R.layout.simple_list_item_1);

        // Add a dataset to the response
        FillResponse.Builder fillResponseBuilder = new FillResponse.Builder();

        for (String domain: parseResult.webDomain) {
            Log.d(TAG, "Domain: " + domain);
        }

        String username = "test@buttercup.pw";
        String password = "testpassword";

        remoteView.setTextViewText(android.R.id.text1, "Autofill using " + username);
        Dataset.Builder builder = new Dataset.Builder(remoteView);

        // Assign the username/password to any found view IDs
        parseResult.email.forEach(id -> builder.setValue(id, AutofillValue.forText(username)));
        parseResult.username.forEach(id -> builder.setValue(id, AutofillValue.forText(username)));
        parseResult.password.forEach(id -> builder.setValue(id, AutofillValue.forText(password)));
        try {
            Dataset dataSet = builder.build();
            fillResponseBuilder.addDataset(dataSet);
            callback.onSuccess(fillResponseBuilder.build());
        } catch (Exception e) {
            callback.onSuccess(null);
        }
    }

    @Override
    public void onSaveRequest(@NonNull SaveRequest request, @NonNull SaveCallback callback) {
        Log.d(TAG, "onSaveRequest");
    }

    @Override
    public void onConnected() {
        Log.d(TAG, "onConnected");
    }

    @Override
    public void onDisconnected() {
        Log.d(TAG, "onDisconnected");
    }
}
